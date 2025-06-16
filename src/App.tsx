import { useState } from 'react'
import { Copy, Shield, AlertTriangle, Check, X, Terminal, Info } from 'lucide-react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Badge } from './components/ui/badge'
import { Textarea } from './components/ui/textarea'
import { toast, Toaster } from 'sonner'

interface TestCommand {
  id: string
  name: string
  description: string
  command: string
  category: 'money' | 'items' | 'weapons' | 'admin' | 'other'
  framework: 'esx' | 'qbcore' | 'renewed' | 'standalone'
  risk: 'low' | 'medium' | 'high'
}

const testCommands: TestCommand[] = [
  // Renewed Banking
  {
    id: 'renewed-money-1',
    name: 'Add Money (Renewed)',
    description: 'Attempts to add $1,000,000 using Renewed Banking',
    command: "TriggerServerEvent('Renewed-Banking:server:AddMoney', 1000000)",
    category: 'money',
    framework: 'renewed',
    risk: 'high'
  },
  {
    id: 'renewed-money-2',
    name: 'Set Balance (Renewed)',
    description: 'Tries to set account balance directly',
    command: "TriggerServerEvent('Renewed-Banking:server:SetBalance', 'bank', 5000000)",
    category: 'money',
    framework: 'renewed',
    risk: 'high'
  },
  {
    id: 'renewed-money-3',
    name: 'Transfer Exploit (Renewed)',
    description: 'Attempts to transfer money from another player',
    command: "TriggerServerEvent('Renewed-Banking:server:TransferMoney', 1, GetPlayerServerId(PlayerId()), 1000000)",
    category: 'money',
    framework: 'renewed',
    risk: 'high'
  },
  // ESX Framework
  {
    id: 'esx-money-1',
    name: 'Give Money (ESX)',
    description: 'Standard ESX money exploit attempt',
    command: "TriggerServerEvent('esx:giveInventoryItem', GetPlayerServerId(PlayerId()), 'item_money', 'money', 1000000)",
    category: 'money',
    framework: 'esx',
    risk: 'high'
  },
  {
    id: 'esx-money-2',
    name: 'Set Account Money (ESX)',
    description: 'Directly set account balance',
    command: "TriggerServerEvent('esx:setAccountMoney', 'bank', 5000000)",
    category: 'money',
    framework: 'esx',
    risk: 'high'
  },
  // QBCore Framework
  {
    id: 'qb-money-1',
    name: 'Add Money (QBCore Bank)',
    description: 'QBCore banking exploit - add to bank',
    command: "TriggerServerEvent('qb-banking:server:AddMoney', 'bank', 1000000, 'testing')",
    category: 'money',
    framework: 'qbcore',
    risk: 'high'
  },
  {
    id: 'qb-money-2',
    name: 'Set Money (QBCore Bank)',
    description: 'Set player bank money directly',
    command: "TriggerServerEvent('QBCore:Server:SetMoney', GetPlayerServerId(PlayerId()), 'bank', 5000000)",
    category: 'money',
    framework: 'qbcore',
    risk: 'high'
  },
  {
    id: 'qb-money-3',
    name: 'Add Money (QBCore Cash)',
    description: 'QBCore banking exploit - add cash',
    command: "TriggerServerEvent('QBCore:Server:AddMoney', 'cash', 1000000)",
    category: 'money',
    framework: 'qbcore',
    risk: 'high'
  },
  {
    id: 'qb-money-4',
    name: 'Set Money (QBCore Cash)',
    description: 'Set player cash directly',
    command: "TriggerServerEvent('QBCore:Server:SetMoney', GetPlayerServerId(PlayerId()), 'cash', 5000000)",
    category: 'money',
    framework: 'qbcore',
    risk: 'high'
  },
  {
    id: 'qb-money-5',
    name: 'Transfer Exploit (QBCore)',
    description: 'Attempts to transfer money from another player (common pattern)',
    command: "TriggerServerEvent('QBCore:Server:TransferMoney', GetPlayerServerId(PlayerId()), 1, 1000000)",
    category: 'money',
    framework: 'qbcore',
    risk: 'high'
  },
  // Items & Weapons
  {
    id: 'esx-item-1',
    name: 'Spawn Item (ESX)',
    description: 'Attempts to spawn items',
    command: "TriggerServerEvent('esx:giveInventoryItem', GetPlayerServerId(PlayerId()), 'item_standard', 'bread', 100)",
    category: 'items',
    framework: 'esx',
    risk: 'medium'
  },
  {
    id: 'qb-weapon-1',
    name: 'Give Weapon (QBCore)',
    description: 'Attempts to give weapon',
    command: "TriggerServerEvent('QBCore:Server:AddItem', 'weapon_pistol', 1)",
    category: 'weapons',
    framework: 'qbcore',
    risk: 'high'
  },
  // Admin Commands
  {
    id: 'admin-1',
    name: 'Set Admin Level',
    description: 'Attempts to grant admin permissions',
    command: "TriggerServerEvent('es_admin:setGroup', GetPlayerServerId(PlayerId()), 'superadmin')",
    category: 'admin',
    framework: 'standalone',
    risk: 'high'
  },
  {
    id: 'admin-2',
    name: 'Teleport All Players',
    description: 'Mass teleport exploit',
    command: "TriggerServerEvent('admin:teleportAll', GetEntityCoords(PlayerPedId()))",
    category: 'admin',
    framework: 'standalone',
    risk: 'high'
  }
]

function App() {
  const [selectedFramework, setSelectedFramework] = useState<string>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [customCommand, setCustomCommand] = useState('')
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})

  const copyCommand = (command: string, id: string) => {
    navigator.clipboard.writeText(command)
    setCopiedId(id)
    toast.success('Command copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const copyCustomCommand = () => {
    if (!customCommand.trim()) {
      toast.error('Please enter a command first')
      return
    }
    navigator.clipboard.writeText(customCommand)
    toast.success('Custom command copied!')
  }

  const markAsTested = (id: string, blocked: boolean) => {
    setTestResults(prev => ({ ...prev, [id]: blocked }))
    toast.success(`Marked as ${blocked ? 'blocked' : 'not blocked'}`)
  }

  const filteredCommands = selectedFramework === 'all' 
    ? testCommands 
    : testCommands.filter(cmd => cmd.framework === selectedFramework)

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-white">FiveM Anti-Cheat Tester</h1>
              <Badge variant="secondary" className="ml-2">Red Engine</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-slate-400" />
              <span className="text-sm text-slate-400">Execute in Red Engine Console</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Warning Alert */}
        <Alert className="mb-8 border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-500">Testing Environment Only</AlertTitle>
          <AlertDescription className="text-slate-300">
            Only use these commands on your own test server. Never use them on public servers.
            These commands help you verify if your anti-cheat properly detects and blocks exploits.
          </AlertDescription>
        </Alert>

        {/* Framework Tabs */}
        <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedFramework}>
          <TabsList className="grid w-full grid-cols-5 bg-slate-800">
            <TabsTrigger value="all">All Frameworks</TabsTrigger>
            <TabsTrigger value="renewed">Renewed</TabsTrigger>
            <TabsTrigger value="esx">ESX</TabsTrigger>
            <TabsTrigger value="qbcore">QBCore</TabsTrigger>
            <TabsTrigger value="standalone">Standalone</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedFramework} className="mt-8">
            <div className="grid gap-4">
              {/* Test Commands Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCommands.map((cmd) => (
                  <Card key={cmd.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-white">{cmd.name}</CardTitle>
                          <CardDescription className="text-slate-400 mt-1">
                            {cmd.description}
                          </CardDescription>
                        </div>
                        <Badge variant={getRiskBadgeVariant(cmd.risk)}>
                          {cmd.risk.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {cmd.framework.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {cmd.category}
                          </Badge>
                        </div>
                        
                        <div className="bg-slate-900 rounded-md p-3 font-mono text-xs text-slate-300 break-all">
                          {cmd.command}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => copyCommand(cmd.command, cmd.id)}
                            className="flex-1"
                          >
                            {copiedId === cmd.id ? (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </>
                            )}
                          </Button>
                          
                          {testResults[cmd.id] === undefined ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAsTested(cmd.id, true)}
                                className="px-2"
                              >
                                <Check className="h-3 w-3 text-green-500" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAsTested(cmd.id, false)}
                                className="px-2"
                              >
                                <X className="h-3 w-3 text-red-500" />
                              </Button>
                            </>
                          ) : (
                            <Badge 
                              variant={testResults[cmd.id] ? 'default' : 'destructive'}
                              className="px-3"
                            >
                              {testResults[cmd.id] ? 'Blocked' : 'Not Blocked'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Custom Command Section */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Custom Command Tester</CardTitle>
                  <CardDescription className="text-slate-400">
                    Enter your own command to test against your anti-cheat
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="TriggerServerEvent('your:custom:event', parameters...)"
                      value={customCommand}
                      onChange={(e) => setCustomCommand(e.target.value)}
                      className="bg-slate-900 border-slate-700 text-slate-100 font-mono text-sm min-h-[100px]"
                    />
                    <Button onClick={copyCustomCommand} variant="secondary" className="w-full">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Custom Command
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card className="bg-blue-500/10 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    How to Test
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300 space-y-2">
                  <p>1. Click "Copy" on any command above</p>
                  <p>2. Open Red Engine executor console while connected to your test server</p>
                  <p>3. Paste and execute the command</p>
                  <p>4. Check if your anti-cheat detects/blocks the action</p>
                  <p>5. Mark the result using the ✓ (blocked) or ✗ (not blocked) buttons</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App