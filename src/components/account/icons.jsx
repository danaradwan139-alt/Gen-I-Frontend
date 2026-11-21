// Stroke icons for the account area. They inherit the surrounding text colour.
const Svg = ({ size = 24, strokeWidth = 1.5, children }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {children}
  </svg>
)

export const OrdersIcon = (p) => <Svg {...p}><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" /><path d="M4 7.5l8 4.5 8-4.5M12 12v9" /></Svg>
export const RepairsIcon = (p) => <Svg {...p}><path d="M4 4l6 6M4 4l-.5 2.5L6 7l1-1-.5-2.5L4 4zM20 4l-9 9M20 4l-2 .5L17 6l1 1 1.5-1L20 4z" /><path d="M12.5 12.5l6 6a1.4 1.4 0 01-2 2l-6-6M8.5 11.5l-4 4a1.4 1.4 0 002 2l4-4" /></Svg>
export const TradeInsIcon = (p) => <Svg {...p}><path d="M17 3l3 3-3 3M20 6H8a4 4 0 00-4 4v1M7 21l-3-3 3-3M4 18h12a4 4 0 004-4v-1" /></Svg>
export const HeartIcon = (p) => <Svg {...p}><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0016.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4 3 5.5l7 7 7-7z" /></Svg>
export const StoreIcon = (p) => <Svg {...p}><path d="M4 9l1.5-5h13L20 9M4 9a2.5 2.5 0 005 0 2.5 2.5 0 005 0 2.5 2.5 0 005 0M5 12v8h14v-8M10 20v-5h4v5" /></Svg>
export const AddressesIcon = (p) => <Svg {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /></Svg>
export const CardIcon = (p) => <Svg {...p}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 10h18M7 15h4" /></Svg>
export const InvoicesIcon = (p) => <Svg {...p}><path d="M5 3h14v18l-2.3-1.5L14.3 21 12 19.5 9.7 21l-2.4-1.5L5 21V3zM9 8h6M9 12h6M9 16h3" /></Svg>
export const UserIcon = (p) => <Svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></Svg>
export const ClockIcon = (p) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>
export const PinIcon = (p) => <Svg {...p}><path d="M19 10c0 5.5-7 11-7 11S5 15.5 5 10a7 7 0 0114 0z" /><circle cx="12" cy="10" r="2.5" /></Svg>
export const LogoutIcon = (p) => <Svg {...p}><path d="M20 12H4M10 6l-6 6 6 6" /></Svg>
export const CloseIcon = (p) => <Svg {...p}><path d="M6 6l12 12M18 6L6 18" /></Svg>
export const ChevronDownIcon = (p) => <Svg {...p}><path d="M6 9l6 6 6-6" /></Svg>
export const LocateIcon = (p) => <Svg {...p}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2.5" /></Svg>
export const PlusIcon = (p) => <Svg {...p}><path d="M12 4v16M4 12h16" /></Svg>
export const CalendarIcon = (p) => <Svg {...p}><rect x="4" y="5" width="16" height="15" rx="3" /><path d="M4 10h16M8 3v4M16 3v4M9 15h6" /></Svg>
export const TrashIcon = (p) => <Svg {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></Svg>
export const CheckIcon = (p) => <Svg {...p}><path d="M20 6L9 17l-5-5" /></Svg>
export const ChevronRightIcon = (p) => <Svg {...p}><path d="M9 18l6-6-6-6" /></Svg>
