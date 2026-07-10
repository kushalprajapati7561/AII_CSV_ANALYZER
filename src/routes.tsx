import type { ReactNode } from 'react';
import { Home } from './pages/Home';
import { Overview } from './pages/Overview';
import { Statistics } from './pages/Statistics';
import { Cleaning } from './pages/Cleaning';
import { Visualization } from './pages/Visualization';
import { Insights } from './pages/Insights';
import { MachineLearning } from './pages/MachineLearning';
import { ModelCompare } from './pages/ModelCompare';
import { FeatureImportance } from './pages/FeatureImportance';
import { Report } from './pages/Report';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  public?: boolean;
}

export const routes: RouteConfig[] = [
  { name: 'Home Dashboard', path: '/', element: <Home /> },
  { name: 'Dataset Overview', path: '/overview', element: <Overview /> },
  { name: 'Statistics', path: '/statistics', element: <Statistics /> },
  { name: 'Data Cleaning', path: '/cleaning', element: <Cleaning /> },
  { name: 'Visualization', path: '/visualization', element: <Visualization /> },
  { name: 'AI Insights', path: '/insights', element: <Insights /> },
  { name: 'Machine Learning', path: '/ml', element: <MachineLearning /> },
  { name: 'Model Compare', path: '/compare', element: <ModelCompare /> },
  { name: 'Feature Importance', path: '/feature-importance', element: <FeatureImportance /> },
  { name: 'Report Generation', path: '/report', element: <Report /> },
];
