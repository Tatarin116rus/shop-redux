import { MantineProvider } from '@mantine/core';
import Header from './components/Header/Header';
import ProductList from './components/ProductList/ProductList';

function App() {
  return (
    <MantineProvider>
      <Header />
      <ProductList />
    </MantineProvider>
  );
}
/* чтобы картинки открылись открой сайт */
export default App;
