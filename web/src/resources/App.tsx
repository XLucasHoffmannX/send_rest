import 'antd/dist/reset.css';
import DataProvider from '../context/DataProvider';
import RouterBrowser from '../routes/RouterBrowser';

function App() {
	return (
		<div className="App">
			<DataProvider>
				<RouterBrowser /> 
			</DataProvider>
		</div>
	);
}

export default App;
