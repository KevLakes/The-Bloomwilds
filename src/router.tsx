import { createBrowserRouter, Navigate } from 'react-router-dom';
import Boot from '@/pages/Boot';
import ProfilePicker from '@/pages/ProfilePicker';
import HowIPlay from '@/pages/HowIPlay';
import Home from '@/pages/Home';
import RegionMap from '@/pages/RegionMap';
import Settings from '@/pages/Settings';
import StickerBook from '@/pages/StickerBook';

export const router = createBrowserRouter([
  { path: '/', element: <Boot /> },
  { path: '/profiles', element: <ProfilePicker /> },
  { path: '/how-i-play', element: <HowIPlay /> },
  { path: '/home', element: <Home /> },
  { path: '/map', element: <RegionMap /> },
  { path: '/settings', element: <Settings /> },
  { path: '/stickers', element: <StickerBook /> },
  { path: '*', element: <Navigate to="/" replace /> },
]);
