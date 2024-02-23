import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import SideBar from './components/SideBar/SideBar';
import Visualize from './components/Visualize/Visualize';
import Analyze from './components/Analyze/Analyze';
import Validate from './components/Validate/Validate';
function App() {
  const [feature, setFeature] = useState('visualize'); //['visualize', 'analyze', 'validate]
  const [checkedClasses, setCheckedClasses] = useState({
    '1-motorbike':true,
    '2-DHelmet':true,
    '3-DNoHelmet':true,
    '4-P1Helmet':true,
    '5-P1NoHelmet':true,
    '6-P2Helmet:':true,
    '7-P2NoHelmet:':true,
    '8-P0Helmet':true,
    '9-P0NoHelmet':true
  });
  const [fileLabel, setFileLabel] = useState()
  const [Bboxes, setBboxes] = useState({})
  const [videoid, setVideoid] = useState(1)
  return (
    <div className="mainContainer">
    <SideBar feature={feature} setFeature={setFeature}/>
    <div className="mainFeature">
        {feature === 'visualize' && <Visualize checkedClassesState={[checkedClasses, setCheckedClasses]} fileLabelState={[fileLabel, setFileLabel]} BboxesState={[Bboxes, setBboxes]} videoidState={[videoid, setVideoid]}/>}
        {feature === 'analyze' && <Analyze/>}
        {feature === 'validate' && <Validate/>}
    </div>
    </div>)
}

export default App;
