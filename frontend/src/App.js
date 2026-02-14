
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import OCRUpload from "./components/OCRUpload";


function App() {
  return (
    <Router>
      <div>

        {/* Routes */}
        <Routes>
         
          <Route path="/" element={<OCRUpload />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;