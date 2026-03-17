import React from 'react';
import {
  Table,
  Text,
  Group,
  ActionIcon,
  ScrollArea,
  Image,
} from '@mantine/core';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { updateQuantity } from '../../store/cartSlice';
import classes from './CartPopup.module.css';

interface CartPopupProps {
  close: () => void;
}

const CartPopup: React.FC<CartPopupProps> = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const totalPrice = useAppSelector((state) => state.cart.totalPrice);

  if (items.length === 0) {
    return (
      <div className={classes.empty}>
        <Text>ты забыл добавить продукты</Text>
        <Image radius="md" src="src\assets\cart_empty.svg" />
        <Text>корзинке грустно</Text>
      </div>
    );
  }

  const rows = items.map((item) => (
    <Table.Tr key={item.id}>
      <Table.Td>
        <Group gap="sm">
          <img
            src={item.image}
            alt={item.name}
            style={{ width: 40, height: 40 }}
          />
          <Text size="sm">{item.name}</Text>
        </Group>
      </Table.Td>
      <Table.Td>${item.price}</Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon
            size="xs"
            onClick={() =>
              dispatch(
                updateQuantity({
                  productId: item.id,
                  quantity: item.quantity - 1,
                })
              )
            }
          >
            –
          </ActionIcon>
          <Text size="sm">{item.quantity}</Text>
          <ActionIcon
            size="xs"
            onClick={() =>
              dispatch(
                updateQuantity({
                  productId: item.id,
                  quantity: item.quantity + 1,
                })
              )
            }
          >
            +
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className={classes.popup}>
      <ScrollArea style={{ maxHeight: 300 }}>
        <Table>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
      <Group justify="space-between" mt="md">
        <Text fw={700}>Total</Text>
        <Text fw={700}>${totalPrice.toFixed(2)}</Text>
      </Group>
    </div>
  );
};

export default CartPopup;
