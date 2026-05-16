import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { CaptionBar } from '@/components/ui/CaptionBar';
import { useA11yCssBridge } from '@/systems/a11y/useA11ySettings';

export function App() {
  useA11yCssBridge();
  return (
    <>
      <RouterProvider router={router} />
      <CaptionBar />
    </>
  );
}

export default App;
