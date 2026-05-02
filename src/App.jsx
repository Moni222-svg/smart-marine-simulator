import React from 'react';
import Header from './components/layout/Header';
import LoadingScreen from './components/layout/LoadingScreen';
import SystemLogs from './components/layout/SystemLogs';
import EngineScene from './components/viewer/EngineScene';
import ControlPanel from './components/controls/ControlPanel';
import TelemetryDashboard from './components/telemetry/TelemetryDashboard';
import AIAlertPanel from './components/alerts/AIAlertPanel';
import FailureSimulation from './components/modes/FailureSimulation';
import ExplodedView from './components/modes/ExplodedView';
import LearningMode from './components/modes/LearningMode';
import MarineMode from './components/modes/MarineMode';
import useEngineStore from './store/engineStore';

export default function App() {
  const isLoading = useEngineStore((s) => s.isLoading);
  const activeTab = useEngineStore((s) => s.activeTab);

  return (
    <div className="w-full h-full flex flex-col bg-navy-950 overflow-hidden relative scan-overlay">
      <LoadingScreen />

      {!isLoading && (
        <>
          {/* Header */}
          <Header />

          {/* Main content */}
          <div className="flex-1 flex min-h-0">
            {/* Left — 3D Viewer */}
            <div className="flex-1 relative">
              <EngineScene />
            </div>

            {/* Right — Panels */}
            <div className="w-[340px] flex flex-col gap-2 p-2 overflow-y-auto">
              <ControlPanel />

              {/* Mode-specific panels */}
              {activeTab === 'failure' && <FailureSimulation />}
              {activeTab === 'exploded' && <ExplodedView />}
              {activeTab === 'learning' && <LearningMode />}
              {activeTab === 'marine' && <MarineMode />}

              <TelemetryDashboard />
              <AIAlertPanel />
            </div>
          </div>

          {/* Bottom — System Logs */}
          <div className="h-[120px] border-t border-white/5">
            <SystemLogs />
          </div>
        </>
      )}
    </div>
  );
}
