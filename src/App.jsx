import Sidebar from './components/Sidebar/Sidebar'
import MapView from './components/Map/MapView'
import AddEventModal from './components/AddEventModal/AddEventModal'
import { useTripStore } from './store/useTripStore'
import styles from './App.module.css'

export default function App() {
  const isAddEventModalOpen = useTripStore((s) => s.isAddEventModalOpen)

  return (
    <div className={styles.shell}>
      <Sidebar />
      <MapView />
      {isAddEventModalOpen && <AddEventModal />}
    </div>
  )
}
