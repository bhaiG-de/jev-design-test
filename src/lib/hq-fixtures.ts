// Small HQ-shaped seed for generated frames. Not the full HQ data graph.

export function truncateAddress(address: string) {
  if (address.length < 12) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const DASHBOARD_STATS = [
  { label: "AUM", value: "$2.4B", trend: "+3.1%", up: true, note: "Book size this month" },
  { label: "Active loans", value: "186", trend: "+8", up: true, note: "Funded and accruing" },
  { label: "Utilization", value: "74%", trend: "-2.4%", up: false, note: "Deployed of available" },
  { label: "Pending approvals", value: "12", trend: "+4", up: false, note: "Waiting on ops" },
] as const

export type LoanRow = {
  id: string
  borrower: string
  pool: string
  asset: string
  principal: string
  collateral: string
  apy: string
  status: "Active" | "Pending" | "Liquidated" | "Matured"
  health: "Healthy" | "At Risk" | "Margin Call" | "Liquidation"
}

export const LOANS: LoanRow[] = [
  {
    id: "0x4838B2c7d1E9f6A0bC5e8D3F7a2B1c4E6D5f97",
    borrower: "Galaxy US",
    pool: "syrupUSDC",
    asset: "USDC",
    principal: "$48,000,000",
    collateral: "1,250 WBTC",
    apy: "8.4%",
    status: "Active",
    health: "Healthy",
  },
  {
    id: "0x930cD9E2f4A8c6B3d5F0e7A1C9b4D6f8E28af1",
    borrower: "FalconX Charlie UK",
    pool: "syrupUSDT",
    asset: "USDT",
    principal: "$22,500,000",
    collateral: "8,400 ETH",
    apy: "9.1%",
    status: "Active",
    health: "At Risk",
  },
  {
    id: "0x7e1dC4a8B2f6D0e3A5c9F1b7E3d5A9c2F48af3",
    borrower: "Wintermute Trading",
    pool: "syrupUSDC",
    asset: "USDC",
    principal: "$15,200,000",
    collateral: "350 WETH",
    apy: "7.6%",
    status: "Active",
    health: "Healthy",
  },
  {
    id: "0x930cE0a2F8b4C6d1A3e7B9f5D2c8E4a0F68af4",
    borrower: "Galaxy UK",
    pool: "syrupUSDT",
    asset: "USDT",
    principal: "$9,800,000",
    collateral: "12.75 WBTC",
    apy: "8.0%",
    status: "Pending",
    health: "Healthy",
  },
  {
    id: "0x5d4cE0a2F8b4C6d1A3e7B9f5D2c8E4a0F6b1D3e5",
    borrower: "FalconX Custody",
    pool: "syrupUSDC",
    asset: "USDC",
    principal: "$6,400,000",
    collateral: "1,200 ETH",
    apy: "10.2%",
    status: "Active",
    health: "Margin Call",
  },
  {
    id: "0x6b2eD3f5A1c9B7e4F0a2C8d6E1b5A3f7D9c0B4e2",
    borrower: "Wintermute Trading",
    pool: "syrupUSDC",
    asset: "USDC",
    principal: "$2,100,000",
    collateral: "0 WBTC",
    apy: "8.8%",
    status: "Liquidated",
    health: "Liquidation",
  },
  {
    id: "0x3a9fB7c1D5e9A3f0C2b6E4d8F1a5B9c3D7e0A2f4",
    borrower: "Maple Intl. Ops",
    pool: "syrupUSDT",
    asset: "USDT",
    principal: "$4,200,000",
    collateral: "25,000 SOL",
    apy: "7.2%",
    status: "Matured",
    health: "Healthy",
  },
  {
    id: "0x1c8aE4b9F2d6C0e5A7b3D9f1C5e8A2b6D4f0C3a1",
    borrower: "Galaxy Singapore",
    pool: "syrupUSDC",
    asset: "USDC",
    principal: "$11,000,000",
    collateral: "620 WETH",
    apy: "8.9%",
    status: "Active",
    health: "At Risk",
  },
]

export type CollateralRow = {
  borrower: string
  loanId: string
  asset: string
  amount: string
  value: string
  ltv: string
  status: "Healthy" | "At Risk" | "Margin Call" | "Liquidation"
  chain: string
}

export const COLLATERAL: CollateralRow[] = [
  {
    borrower: "FalconX Charlie UK",
    loanId: "0x4838B2c7d1E9f6A0bC5e8D3F7a2B1c4E6D5f97",
    asset: "ETH",
    amount: "5,500.00",
    value: "$18,812,750",
    ltv: "62.4%",
    status: "Healthy",
    chain: "Ethereum",
  },
  {
    borrower: "Galaxy US",
    loanId: "0x930cD9E2f4A8c6B3d5F0e7A1C9b4D6f8E28af1",
    asset: "USDC",
    amount: "1,500,000.00",
    value: "$1,500,000",
    ltv: "78.2%",
    status: "At Risk",
    chain: "Ethereum",
  },
  {
    borrower: "Wintermute Trading",
    loanId: "0x7e1dC4a8B2f6D0e3A5c9F1b7E3d5A9c2F48af3",
    asset: "WETH",
    amount: "350.50",
    value: "$1,198,835",
    ltv: "55.1%",
    status: "Healthy",
    chain: "Ethereum",
  },
  {
    borrower: "Galaxy US",
    loanId: "0x930cE0a2F8b4C6d1A3e7B9f5D2c8E4a0F68af4",
    asset: "WBTC",
    amount: "12.75",
    value: "$1,785,002",
    ltv: "45.3%",
    status: "Healthy",
    chain: "Ethereum",
  },
  {
    borrower: "FalconX Custody",
    loanId: "0x5d4cE0a2F8b4C6d1A3e7B9f5D2c8E4a0F6b1D3e5",
    asset: "ETH",
    amount: "1,200.00",
    value: "$4,104,600",
    ltv: "88.5%",
    status: "Margin Call",
    chain: "Ethereum",
  },
  {
    borrower: "Wintermute Trading",
    loanId: "0x6b2eD3f5A1c9B7e4F0a2C8d6E1b5A3f7D9c0B4e2",
    asset: "WBTC",
    amount: "0.00",
    value: "$0",
    ltv: "100%",
    status: "Liquidation",
    chain: "Ethereum",
  },
  {
    borrower: "Maple Intl. Ops",
    loanId: "0x3a9fB7c1D5e9A3f0C2b6E4d8F1a5B9c3D7e0A2f4",
    asset: "SOL",
    amount: "25,000.00",
    value: "$4,656,250",
    ltv: "71.8%",
    status: "At Risk",
    chain: "Solana",
  },
]

export type OrganizationRow = {
  name: string
  entities: number
  users: number
  wallets: number
  status: "Active" | "Pending KYB"
}

export const ORGANIZATIONS: OrganizationRow[] = [
  { name: "Galaxy Digital", entities: 3, users: 12, wallets: 18, status: "Active" },
  { name: "FalconX", entities: 2, users: 8, wallets: 11, status: "Active" },
  { name: "Wintermute", entities: 1, users: 5, wallets: 7, status: "Active" },
  { name: "BlockFi Trading", entities: 2, users: 4, wallets: 6, status: "Pending KYB" },
  { name: "Maple Intl. Ops", entities: 1, users: 9, wallets: 14, status: "Active" },
  { name: "Amber Group", entities: 2, users: 6, wallets: 9, status: "Active" },
]

export type EntityRow = {
  name: string
  organization: string
  kind: "SPV" | "Fund" | "Subsidiary" | "Branch"
  wallets: number
  loans: number
  status: "Active" | "Pending"
}

export const ENTITIES: EntityRow[] = [
  { name: "Galaxy US", organization: "Galaxy Digital", kind: "Subsidiary", wallets: 8, loans: 4, status: "Active" },
  { name: "Galaxy UK", organization: "Galaxy Digital", kind: "SPV", wallets: 5, loans: 2, status: "Active" },
  { name: "Galaxy Singapore", organization: "Galaxy Digital", kind: "Branch", wallets: 5, loans: 1, status: "Active" },
  { name: "FalconX Charlie UK", organization: "FalconX", kind: "SPV", wallets: 6, loans: 3, status: "Active" },
  { name: "FalconX Custody", organization: "FalconX", kind: "Subsidiary", wallets: 5, loans: 1, status: "Pending" },
  { name: "Wintermute Trading", organization: "Wintermute", kind: "Fund", wallets: 7, loans: 2, status: "Active" },
]
