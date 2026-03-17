import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SimpleGrid, Loader, Center, Text } from '@mantine/core';
import ProductCard from '../ProductCard/ProductCard';
import  { fetchProducts } from '../../store/productsSlice';
import type { RootState, AppDispatch } from '../../store/store';

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading === 'pending') {
    return (
      <Center style={{ minHeight: '400px' }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (loading === 'failed') {
    return (
      <Center style={{ minHeight: '400px' }}>
        <Text c="red">Ошибка загрузки: {error}</Text>
      </Center>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg" p="md">
      {items.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </SimpleGrid>
  );
};

export default ProductList;