interface BluetoothLEScanFilter {
  services?: BluetoothServiceUUID[]
  name?: string
  namePrefix?: string
}

type BluetoothServiceUUID = string

interface BluetoothDevice {}

interface BluetoothRemoteGATTServer {}
