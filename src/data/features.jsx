import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

// Static feature list for the About section.
// `icon` holds the actual MUI icon component so the component can render <feature.icon />.

const features = [
  {
    id: 'selection',
    title: 'Wide Selection',
    description: 'Fashion, electronics, and more - all in one place.',
    icon: Inventory2OutlinedIcon,
  },
  {
    id: 'quality',
    title: 'Trusted Quality',
    description: 'Every product is checked before it reaches you.',
    icon: VerifiedOutlinedIcon,
  },
  {
    id: 'delivery',
    title: 'Fast Delivery',
    description: 'Quick, reliable shipping to your doorstep.',
    icon: LocalShippingOutlinedIcon,
  },
];

export default features;