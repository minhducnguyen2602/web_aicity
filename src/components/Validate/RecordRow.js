import styles from './RecordRow.module.css'
const RecordRow = ({time, note, mAP, apClass1, apClass2, apClass3, apClass4, apClass5, apClass6, apClass7, apClass8, apClass9}) => {

    return (
        <div className={styles.recordRow}>
                
                    <div className={styles.recordColDouble}>{note}</div>
                    <div className={styles.recordCol}>{mAP}</div>
                    <div className={styles.recordCol}>{apClass1}</div>
                    <div className={styles.recordCol}>{apClass2}</div>
                    <div className={styles.recordCol}>{apClass3}</div>
                    <div className={styles.recordCol}>{apClass4}</div>
                    <div className={styles.recordCol}>{apClass5}</div>
                    <div className={styles.recordCol}>{apClass6}</div>
                    <div className={styles.recordCol}>{apClass7}</div>
                    <div className={styles.recordCol}>{apClass8}</div>
                    <div className={styles.recordCol}>{apClass9}</div>
                </div>
)}
export default RecordRow