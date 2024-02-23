import styles from './SideBar.module.css'
const SideBar = ({feature,setFeature}) => {

    return (
        <div className={styles.mainContainer}>
           <div title='Visualize' className={styles.featureBox + ' ' + (feature === 'visualize' ? styles.active : '')} onClick={() => setFeature('visualize')}>
                <i className="fa-solid fa-tv"></i>
            </div>
           <div title="Analyze" className={styles.featureBox + ' ' + (feature === 'analyze' ? styles.active : '')} onClick={() => setFeature('analyze')}>
                <i className="fa-solid fa-magnifying-glass-chart"></i>
           </div>
           <div title="Validate" className={styles.featureBox + ' ' + (feature === 'validate' ? styles.active : '')} onClick={() => setFeature('validate')}>
                <i className="fa-solid fa-check"></i>
           </div>
        </div>
    )
}
export default SideBar