import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {} from './OrderSlice';
import styles from './Counter.module.css';

export default function Counter() {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();
  return (
    <div>
      <div className={styles.row}>
      </div>
    </div>
  );
}
