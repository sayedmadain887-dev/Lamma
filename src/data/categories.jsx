import CheckroomIcon from '@mui/icons-material/Checkroom';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import ChairIcon from '@mui/icons-material/Chair';
import SpaIcon from '@mui/icons-material/Spa';
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

// Static category list for now.
// Later this can be replaced by a fetch call to GET /api/categories
// without changing how components consume it (same shape: array of objects).
// `icon` holds the actual MUI icon component so consumers can just render <category.icon />.

const categories = [
  { id: 'fashion', label: 'Fashion', slug: 'fashion', icon: CheckroomIcon },
  { id: 'electronics', label: 'Electronics', slug: 'electronics', icon: DevicesOtherIcon },
  { id: 'home', label: 'Home', slug: 'home', icon: ChairIcon },
  { id: 'beauty', label: 'Beauty', slug: 'beauty', icon: SpaIcon },
  { id: 'kids', label: 'Kids', slug: 'kids', icon: ChildFriendlyIcon },
  { id: 'sports', label: 'Sports', slug: 'sports', icon: SportsSoccerIcon },
];

export default categories;