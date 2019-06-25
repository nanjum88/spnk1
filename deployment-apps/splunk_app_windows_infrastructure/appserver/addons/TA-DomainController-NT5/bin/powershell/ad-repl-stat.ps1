## Global Variables ##

$DomainControllerName   = [System.DirectoryServices.ActiveDirectory.Domain]::GetCurrentDomain().FindDomainController().Name
#$site = [System.DirectoryServices.ActiveDirectory.ActiveDirectorySite]::GetComputerSite()

## Functions ##

function Get-ADSite
{

	[CmdletBinding(
		ConfirmImpact="Low",
		DefaultParameterSetName="Name"
	)]
	
	Param (
		[Parameter(Mandatory=$true,Position=0,ValueFromPipeline=$true,ParameterSetName="Name")]
		[ValidateNotNullOrEmpty()]
		[string] $Name,
		
		[Parameter(Mandatory=$true,ParameterSetName="All")]
		[switch] $All,
		
		[Parameter(Mandatory=$true,ParameterSetName="Current")]
		[switch] $Current,
		
		[Parameter(Mandatory=$true,ParameterSetName="ByIPAddress")]
		[System.Net.IPAddress] $IPAddress,
		
		[Parameter(Mandatory=$false)]
		[ValidateScript({
			if (-not $_.Contains("."))
			{
				throw "The Name must be a FQDN"
			}
			return $true
		})]
		[string] $Server
	)
 
	begin {
		$script:ctx = $null
		try
		{
			if (-not $Server)
			{
				$script:Server = [System.DirectoryServices.ActiveDirectory.Domain]::GetCurrentDomain().FindDomainController().Name
				$script:ctx = New-Object System.DirectoryServices.ActiveDirectory.DirectoryContext("DirectoryServer", $script:Server)
			}
			else
			{
				$script:Server = $Server
				$script:ctx = New-Object System.DirectoryServices.ActiveDirectory.DirectoryContext("DirectoryServer", $script:Server)
			}
		}
		catch [Exception]
		{
			Write-Error $_
			return
		}
	}
 
	process {
		$site = $null
		try
		{
			switch ($pscmdlet.ParameterSetName)
			{
				"name"
				{
					[System.DirectoryServices.ActiveDirectory.ActiveDirectorySite]::FindByName($script:ctx, $name)
				}
            }
		}
		catch [Exception]
		{
			Write-Error -Exception $_.Exception -Message "Could not get the site / sites"
		}
    }
	
	end { }
}

function GetSingleDomainController
{
	param(
		[Parameter(Mandatory=$true)]
		[ValidateScript({
			if (-not $_.Contains("."))
			{
				throw "The Name must be a FQDN"
			}
			return $true
		})]
		[string] $DomainControllerName
	)
	
	$rootDSE = [adsi]"LDAP://$script:server/rootDSE"

	$ds = New-Object System.DirectoryServices.DirectorySearcher
	$ds.SearchRoot = "LDAP://$script:server/CN=Sites,$($rootDSE.configurationNamingContext)"
	$ds.Filter = "(&(objectclass=server)(dNSHostName=$DomainControllerName))"

	try
	{
		$serverDn = $ds.FindOne().GetDirectoryEntry().DistinguishedName.Value
		$siteDn = $serverDn.Substring($serverDn.IndexOf("CN=Servers") + 11, $serverDn.IndexOf("CN=Sites") - ($serverDn.IndexOf("CN=Servers") + 12))
		$siteName = $siteDn.Substring(3)
	}
	catch [Exception]
	{
		throw "Could not find domain controller in $($ds.SearchRoot.DistinguishedName): $($_.Exception.Message)"
	}

	try
	{
		$dc = (Get-ADSite -Name $siteName -Server $script:Server).Servers | Where-Object { $_.Name -eq $DomainControllerName }
        if (-not $dc)
		{
			throw "The server $DomainControllerName cannot be found"
		}
		$dc
	}
	catch [Exception]
	{
		throw "Cannot read servers from site $siteName: ($_.Exception.Message)"
	}
}

function Get-Type
{
	param(
    	[Parameter(Position=0,Mandatory=$true)]
		[string] $GenericType,
		
		[Parameter(Position=1,Mandatory=$true)]
		[string[]] $T
    )

	$Types = $T -as [type[]]
	
	try
	{
		$generic = [type]($GenericType + '`' + $Types.Count)
		$generic.MakeGenericType($Types)
	}
	catch [Exception]
	{
		throw New-Object System.Exception("Cannot create generic type", $_.Exception)
	}
}


function Get-ADReplicationLink
{
	[CmdletBinding()]
	
	param(		
		[Parameter(Mandatory=$true,ParameterSetName="AllDCsInSite",ValueFromPipelineByPropertyName=$true)]
		[string] $SiteName,
		
		[Parameter(Mandatory=$true,ParameterSetName="AllDCsInForest")]
		[switch] $AllDCsInForest,
		
		[Parameter(Mandatory=$true,ParameterSetName="AllDCsInDomain")]
		[switch] $AllDCsInDomain,
		
		[Parameter(Mandatory=$false,ValueFromPipelineByPropertyName=$true)]
		[ValidateScript({
			if (-not $_.Contains("."))
			{
				throw "The Name must be a FQDN"
			}
			return $true
		})]
		[string] $DomainName,
		
		[Parameter(Position=0,Mandatory=$false,ValueFromPipelineByPropertyName=$true,ParameterSetName="DcByName")]
		[ValidateScript({
			if (-not $_.Contains("."))
			{
				throw "The Name must be a FQDN"
			}
			return $true
		})]
		[Alias("DCName")]
		[string[]] $DomainControllerName,
		
		[Parameter(Position=0,Mandatory=$false,ValueFromPipelineByPropertyName=$true)]
		[Alias("NC")]
		[string] $NamingContext,
		
		[Parameter(Mandatory=$false)]
		[switch] $ErrorsOnly,
		
		[Parameter(Mandatory=$false)]
		[string] $Server
	)
	
	begin {
		$global:tempDestinationServer = $null
		$script:ctx = $null
		try
		{
			if (-not $Server)
			{
				$script:Server = [System.DirectoryServices.ActiveDirectory.Domain]::GetCurrentDomain().FindDomainController().Name
				$script:ctx = New-Object System.DirectoryServices.ActiveDirectory.DirectoryContext("DirectoryServer", $script:Server)
				
				$script:serverObject = [System.DirectoryServices.ActiveDirectory.Domain]::GetCurrentDomain().FindDomainController()
			}
			else
			{
				$script:Server = $Server
				$script:ctx = New-Object System.DirectoryServices.ActiveDirectory.DirectoryContext("DirectoryServer", $script:Server)
				
				$script:serverObject = GetSingleDomainController -DomainControllerName $Server
			}
		}
		catch [Exception]
		{
			Write-Error $_
			return
		}
	}
 
	process {
		$dcList = New-Object System.Collections.ArrayList
			foreach ($DomainController in $DomainControllerName)
			{
				[Void]$dcList.Add((GetSingleDomainController -DomainControllerName $DomainController))
			}
		
		foreach ($dc in $dcList)
		{
            foreach ($partition in $dc.Partitions)
			{
				$repNeighbors = $dc.GetReplicationNeighbors($partition)
				if ($ErrorsOnly)
				{
					$repNeighbors = $repNeighbors | Where-Object { $_.LastSyncResult -ne 0 }
				}
				
				foreach ($repNeighbor in $repNeighbors)
				{
					$repInfo = New-Object (Get-Type -GenericType System.Collections.Generic.List -T System.Management.Automation.PSObject)
                    $repNeighbor = $repNeighbor | Add-Member -MemberType NoteProperty -Name DestinationServer -Value $dc.Name -PassThru
					$repInfo.Add([psobject]$repNeighbor)
                    $repInfo | ForEach-Object {
                        $repl = new-object System.Collections.ArrayList
                        $currtime = Get-Date -format 'yyyy-MM-ddTHH:mm:sszzz'
                        $repltime = get-date  -format "yyyy-MM-dd HH:mm:ss zzz" -date $($_.LastAttemptedSync)
                        [void]$repl.add($currtime);
                        [void]$repl.add("LastAttemptedSync=`"$repltime`"")
                        [void]$repl.add("type=`"ReplicationEvent`"")
                        [void]$repl.add("usn=$($_.UsnLastObjectChangeSynced)")
                        [void]$repl.add("src_host=`"$($_.SourceServer)`"")
                        [void]$repl.add("Result=`"$($_.LastSyncResult)`"")
                        [void]$repl.add("transport=`"$($_.TransportType)`"")
                        [void]$repl.add("naming_context=`"$($repNeighbor.PartitionName)`"")
                        [string]::join(' ', $repl) | Write-Host}
            
 				}

			}
		}

    }
	
	end { }
}

## Call The functions ##

Get-ADReplicationlink $DomainControllerName 