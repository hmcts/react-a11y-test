import { FC } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useRouteAnnouncer } from '@/hooks/useRouteAnnouncer'

// Import pages directly for now to avoid lazy loading issues
import { Home } from '@/pages/Home'
import { Forms } from '@/pages/Forms'
import { Components } from '@/pages/Components'
import { MojComponents } from '@/pages/MojComponents'
import { Journey } from '@/pages/Journey'
import { JourneySearch } from '@/pages/JourneySearch'
import { JourneySearchByName } from '@/pages/JourneySearchByName'
import { ManchesterCrownCourt } from '@/pages/ManchesterCrownCourt'
import { BirminghamCrownCourt } from '@/pages/BirminghamCrownCourt'
import { InnerLondonCrownCourt } from '@/pages/InnerLondonCrownCourt'
import { NotFound } from '@/pages/NotFound'

// Page title per route, announced to screen readers on navigation via
// useRouteAnnouncer. Keep in sync with each page's <h1>.
const routeTitles: Record<string, string> = {
  '/': 'React Single-page Application (SPA) Proof of Concept',
  '/forms': 'Forms',
  '/components': 'Components',
  '/moj-components': 'MoJ Design System Components',
  '/journey': 'Find a court or tribunal',
  '/journey/search': 'Do you know the name of the court or tribunal',
  '/journey/search-by-name': 'What is the name or address of the court or tribunal?',
  '/court/manchester-crown-court': 'Manchester Crown Court (Minshull St)',
  '/court/birmingham-crown-court': 'Birmingham Crown Court',
  '/court/inner-london-crown-court': 'Inner London Crown Court',
}

const App: FC = () => {
  useRouteAnnouncer(routeTitles)

  return (
    <ErrorBoundary>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forms" element={<Forms />} />
          <Route path="/components" element={<Components />} />
          <Route path="/moj-components" element={<MojComponents />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/journey/search" element={<JourneySearch />} />
          <Route path="/journey/search-by-name" element={<JourneySearchByName />} />
          <Route path="/court/manchester-crown-court" element={<ManchesterCrownCourt />} />
          <Route path="/court/birmingham-crown-court" element={<BirminghamCrownCourt />} />
          <Route path="/court/inner-london-crown-court" element={<InnerLondonCrownCourt />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  )
}

export default App
