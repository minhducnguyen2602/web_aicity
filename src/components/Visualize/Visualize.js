import styles from './Visualize.module.css'
import { useEffect, useRef, useState } from 'react';
import BoundingBoxViewer from '../BoundingBoxViewer/BoundingBoxViewer';
import ProcessBboxes from './ProcessBboxes';
const Visualize = ({checkedClassesState, fileLabelState, BboxesState, videoidState}) => {
    const [checkedClasses, setCheckedClasses] = checkedClassesState;
    const [fileLabel, setFileLabel] = fileLabelState
    const [Bboxes, setBboxes] = BboxesState
    const [videoid, setVideoid] = videoidState
    const inputVideoIDRef = useRef()
    const viewRef = useRef(null)
    const handleCheckboxChange = (checkboxName) => {
        setCheckedClasses({
          ...checkedClasses,
          [checkboxName]: !checkedClasses[checkboxName],
        });
        console.log(checkedClasses)
      };
    const checkboxes = ['1-motorbike','2-DHelmet','3-DNoHelmet','4-P1Helmet','5-P1NoHelmet','6-P2Helmet:','7-P2NoHelmet:','8-P0Helmet','9-P0NoHelmet'];
    const colors = ['black', 'Chartreuse', 'OrangeRed', 'DarkViolet', 'Orange', 'DodgerBlue', 'Yellow', 'MediumOrchid', 'DeepPink'];
    const videoURL_template = 'http://localhost:82/video/'
    const handleFileChange = (e) => {
        // Access the selected file from e.target.files
        const selectedFile = e.target.files[0];
    
        // Update the state with the selected file
        setFileLabel(selectedFile);
    
        // If you want to see the details of the selected file, you can log it
        console.log('Selected file:', selectedFile);
      };
      function convertIntToString(value) {
        // Convert the integer to a string
        let stringValue = value.toString();
    
        // Add leading zeros if necessary
        while (stringValue.length < 3) {
            stringValue = '0' + stringValue;
        }
    
        return stringValue;
    }
    const inputVideoID = (e) => {
        let value = parseInt(e.target.value, 10)
        if (isNaN(value)) {
            value = 1;
            // e.target.value = ''
          }
        if (value>100) value =100;
        if (value<1) value = 1;
        setVideoid(value)
    }
    useEffect(() => {
        if (viewRef.current)
        viewRef.current.videoURL = videoURL_template + convertIntToString(videoid) + '.mp4'
    },[videoid])
    const handleInputVideoId = (e) => {
        inputVideoIDRef.current.style.display = 'block';
    }
    return <div className={styles.mainContainer}>
        <div className={styles.resultZone}>
            {/* <div className={styles.controlBar}></div> */}
            <div className={styles.videoZone}>
                {(Bboxes[videoid]) && <BoundingBoxViewer key={videoid} ref= {viewRef} videoURL={videoURL_template + convertIntToString(videoid) + '.mp4'} boundingBoxes={Bboxes[videoid]} />}
                {(!Bboxes[videoid]) && <BoundingBoxViewer videoURL='' boundingBoxes={{}} />}
            </div>
            <div className={styles.controlBar}>
                <div className={styles.arrowButton} onClick={() => {if (videoid > 1) setVideoid(videoid - 1)}}>
                    <i className="fa-solid fa-chevron-left"></i>
                </div>
                <div className={styles.currentVideo} onClick={handleInputVideoId}>{videoid}
                <input ref={inputVideoIDRef} type='text' className={styles.videoidInput} placeholder={videoid} onChange={inputVideoID} onBlur={(e)=>e.target.style.display = 'none'}></input>
                </div>
                <div className={styles.arrowButton} onClick={() => {if (videoid < 100) setVideoid(videoid + 1)}}>
                    <i className="fa-solid fa-chevron-right"></i>
                </div>
            </div>
        </div>
        <div className={styles.configZone}>
            <div className={styles.inputZone}>
                <label htmlFor="label_file" >Label file</label>
                <input name="label_file" type="file" className={styles.inputFile} onChange={handleFileChange}></input>
           </div>
           <div className={styles.classesZone}>
           {checkboxes.map((checkbox, index) => (
                    <div key={index}>
                    <input
                        type="checkbox"
                        id={checkbox}
                        name={checkbox}
                        checked={checkedClasses[checkbox] || false}
                        onChange={() => handleCheckboxChange(checkbox)}
                    />
                    <label htmlFor={checkbox} style={{color: colors[index], marginLeft: '10px'}}>{checkbox}</label>
                    </div>
                ))}
           </div>
           <div className={styles.processButton} onClick={async () => ProcessBboxes(fileLabel, checkedClasses, setBboxes)}>
            Process
        </div>
        </div>
        
    </div>
}
export default Visualize