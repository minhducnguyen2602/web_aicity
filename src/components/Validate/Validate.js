import RecordRow from './RecordRow'
import styles from './Validate.module.css'
import { useEffect, useRef, useState } from 'react'
import loadHistory from './loadHistory'
import submit from './submit'
const Validate = () => {
    const [gtfile, seGtfile] = useState()
    const [predfile, setPredfile] = useState()
    const [history, setHistory] = useState([])
    const noteRef = useRef()
    useEffect(() => {
        loadHistory(setHistory)
    }, [])
    const handleSubmit = () => {
        const note = noteRef.current.value
        submit(gtfile, predfile, setHistory, note)
    }
    return (
        <div className={styles.mainContainer}>
            <div className={styles.uploadFiles}>
                <div className={styles.inputContainer}>
                <label htmlFor="file1"  className={styles.fileLabel}>Ground Truth</label>
                <input type="file" id="file1" name="file1" onChange={(e) => {seGtfile(e.target.files[0])}}></input>
                </div>
                
                <div className={styles.inputContainer}>
                <label htmlFor="file2"  className={styles.fileLabel}>Predicted</label>
                <input type="file" id="file2" name="file2" onChange={(e) => setPredfile(e.target.files[0])}></input>
                </div>

                <div className={styles.inputContainer}>
                <label htmlFor="note"  className={styles.fileLabel}>Note</label>
                <input ref={noteRef} type="text" id="note" name="note" className={styles.inputText}></input>
                </div>

                <div className={styles.submitButton} onClick={handleSubmit}>Submit</div>
            </div>
            <div className={styles.submitHistory}>
                <RecordRow note={"Note"} mAP={"mAP"} apClass1={"AP-Class1"} apClass2={"AP-Class2"} apClass3={"AP-Class3"} apClass4={"AP-Class4"} apClass5={"AP-Class5"} apClass6={"AP-Class6"} apClass7={"AP-Class7"} apClass8={"AP-Class8"} apClass9={"AP-Class9"} />
                {history.map((re, i)=> <RecordRow
                    key={i}
                    note={re.note}
                    mAP={re.mAP}
                    apClass1={re.apClass1}
                    apClass2={re.apClass2}
                    apClass3={re.apClass3}
                    apClass4={re.apClass4}
                    apClass5={re.apClass5}
                    apClass6={re.apClass6}
                    apClass7={re.apClass7}
                    apClass8={re.apClass8}
                    apClass9={re.apClass9}
                />)}
            </div>
        </div>
    )
}
export default Validate