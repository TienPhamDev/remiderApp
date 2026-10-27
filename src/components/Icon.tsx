import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../theme';

export type IconName =
  | 'circle'
  | 'check-circle'
  | 'flag'
  | 'trash'
  | 'search'
  | 'add'
  | 'home'
  | 'calendar'
  | 'category'
  | 'graph'
  | 'setting'
  | 'close'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'clock'
  | 'bell'
  | 'edit'
  | 'more'
  | 'grip';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
};

// Icon vẽ bằng SVG (viewBox 24x24), nét 1.5 theo phong cách icon trong Figma
export function Icon({ name, size = 24, color = colors.text }: Props) {
  const stroke = {
    stroke: color,
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill: 'none',
  } as const;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'circle' && <Circle cx={12} cy={12} r={10} {...stroke} />}
      {name === 'check-circle' && (
        <>
          <Circle cx={12} cy={12} r={10} fill={color} />
          <Path
            d="M7.5 12.5l3 3 6-6.5"
            stroke={colors.background}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </>
      )}
      {name === 'flag' && (
        <>
          <Path d="M5 21V3" {...stroke} />
          <Path d="M5 4h13l-3 4.5 3 4.5H5z" {...stroke} fill={color} />
        </>
      )}
      {name === 'trash' && <Path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 10v6M14 10v6" {...stroke} />}
      {name === 'search' && (
        <>
          <Circle cx={11} cy={11} r={8} {...stroke} />
          <Path d="M21 21l-4.35-4.35" {...stroke} />
        </>
      )}
      {name === 'add' && <Path d="M12 5v14M5 12h14" {...stroke} />}
      {name === 'home' && <Path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22v-9h6v9" {...stroke} />}
      {name === 'calendar' && (
        <>
          <Rect x={3} y={4} width={18} height={18} rx={3} {...stroke} />
          <Path d="M16 2v4M8 2v4M3 10h18" {...stroke} />
        </>
      )}
      {name === 'category' && (
        <>
          <Rect x={3} y={3} width={18} height={18} rx={4} {...stroke} />
          <Path d="M7.5 9l1.2 1.2L10.8 8M7.5 15l1.2 1.2 2.1-2.2M13.5 9.5H17M13.5 15.5H17" {...stroke} />
        </>
      )}
      {name === 'graph' && (
        <>
          <Path d="M21.2 15.9A10 10 0 1 1 8 2.8" {...stroke} />
          <Path d="M22 12A10 10 0 0 0 12 2v10z" {...stroke} />
        </>
      )}
      {name === 'close' && <Path d="M6 6l12 12M18 6L6 18" {...stroke} />}
      {name === 'chevron-down' && <Path d="M6 9l6 6 6-6" {...stroke} />}
      {name === 'chevron-right' && <Path d="M9 5l7 7-7 7" {...stroke} />}
      {name === 'chevron-left' && <Path d="M15 5l-7 7 7 7" {...stroke} />}
      {name === 'clock' && (
        <>
          <Circle cx={12} cy={12} r={10} {...stroke} />
          <Path d="M12 6.5V12l3.5 2" {...stroke} />
        </>
      )}
      {name === 'bell' && (
        <Path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" {...stroke} />
      )}
      {name === 'edit' && (
        <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z" {...stroke} />
      )}
      {name === 'more' && (
        <>
          <Circle cx={5} cy={12} r={1.6} fill={color} />
          <Circle cx={12} cy={12} r={1.6} fill={color} />
          <Circle cx={19} cy={12} r={1.6} fill={color} />
        </>
      )}
      {name === 'grip' && (
        <>
          {[8, 12, 16].flatMap((cy) => [9, 15].map((cx) => <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.4} fill={color} />))}
        </>
      )}
      {name === 'setting' && (
        <>
          <Circle cx={12} cy={12} r={3} {...stroke} />
          <Path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
            {...stroke}
          />
        </>
      )}
    </Svg>
  );
}
