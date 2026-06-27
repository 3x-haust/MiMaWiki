import { EngineCatalogCards } from './EngineCatalogCards';
import { EngineControlCards } from './EngineControlCards';
import type { EnginePanelProps } from './EnginePanelTypes';
import { FeatureGrid, Panel, PanelTitle } from './styles';

export const EnginePanel = (props: EnginePanelProps) => (
  <Panel aria-label="위키 엔진">
    <PanelTitle>위키 엔진</PanelTitle>
    <FeatureGrid>
      <EngineCatalogCards {...props} />
      <EngineControlCards {...props} />
    </FeatureGrid>
  </Panel>
);
