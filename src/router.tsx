import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Boot from '@/pages/Boot';
import ProfilePicker from '@/pages/ProfilePicker';
import HowIPlay from '@/pages/HowIPlay';
import Home from '@/pages/Home';
import Settings from '@/pages/Settings';
import StickerBook from '@/pages/StickerBook';
import SparkCloset from '@/pages/SparkCloset';
import Overworld from '@/engine/overworld/Overworld';
import RegionScene from '@/engine/region/RegionScene';
import ChallengeRoute from '@/engine/challenge/ChallengeHost';
import { PageTransition } from '@/components/ui/PageTransition';

function RootLayout() {
  return (
    <PageTransition>
      <Outlet />
    </PageTransition>
  );
}

export const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        { path: '/', element: <Boot /> },
        { path: '/profiles', element: <ProfilePicker /> },
        { path: '/how-i-play', element: <HowIPlay /> },
        { path: '/home', element: <Home /> },
        { path: '/map', element: <Overworld /> },
        { path: '/map/:regionId', element: <RegionScene /> },
        { path: '/play/:challengeId', element: <ChallengeRoute /> },
        { path: '/settings', element: <Settings /> },
        { path: '/stickers', element: <StickerBook /> },
        { path: '/spark', element: <SparkCloset /> },
        { path: '*', element: <Navigate to="/" replace /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' },
);
