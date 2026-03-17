import React, { useState } from 'react';
import { Group, Text, Button, Badge, Popover } from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons-react';
import { useAppSelector } from '../../store/hooks';
import CartPopup from '../CartPopup/CartPopup';
import classes from './Header.module.css';

const Header: React.FC = () => {
  const totalQuantity = useAppSelector((state) => state.cart.totalQuantity);
  const [opened, setOpened] = useState(false);

  return (
    <Group className={classes.header} justify="space-between" p="md">
      <Text className={classes.Vegetable} size="xl" fw={500}>
        Vegetable
        <Text
          component="span"
          className={classes.shop}
          size="xl"
          color="white"
          fw={500}
        >
          SHOP
        </Text>
      </Text>
      <Popover
        opened={opened}
        onChange={setOpened}
        position="bottom-end"
        withArrow
        shadow="md"
      >
        <Popover.Target>
          <Button
            radius={10}
            color="#54B46A"
            onClick={() => setOpened((o) => !o)}
          >
            {totalQuantity > 0 && (
              <Badge color="white" size="sm" circle style={{ color: 'black' }}>
                {totalQuantity}
              </Badge>
            )}
            <Text size="xl" fw={500}>
              Cart
            </Text>
            <IconShoppingCart size={24} />
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <CartPopup close={() => setOpened(false)} />
        </Popover.Dropdown>
      </Popover>
    </Group>
  );
};

export default Header;
