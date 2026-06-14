export const ArrowIcon = ({ state, size = 16 }: {state: "chevron" | "arrow", size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
    <path
      d="M4 8L13.0002 8.00024"
      style={{
        transformBox: 'fill-box',
        transformOrigin: 'left center',
        transform: state === 'arrow' ? 'scaleX(1)' : 'scaleX(0)',
        transition: 'transform var(--duration-fast) var(--ease-swift-out)',
        // d: state === 'arrow' ? "path('M4 8L13.0002 8.00024')" : "path('M6.5 8L6.5001 8')",
        // transition: 'd var(--duration-fast) var(--ease-swift-out)',
      }}
    />
    <path 
      d="M9.50024 5.00073L7.10023 6.80034C6.30013 7.40028 6.30004 8.60033 7.10004 9.2004L9.50024 11.0007" 
      style={{
        transform: state === 'arrow' ? 'translateX(-2.5px)' : 'translateX(0)',
        transition: 'transform var(--duration-fast) var(--ease-swift-out)',
      }}
    />
  </svg>
);
