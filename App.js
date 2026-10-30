
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  StatusBar
} from 'react-native';

function Display({ value }) {
  return (
    <View style={styles.display}>
      <Text
        style={styles.displayText}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
    </View>
  );
}

function CalcButton({ title, onPress, type, wide }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        wide && styles.wideButton,
        type === 'top' && styles.topButton,
        type === 'operator' && styles.operatorButton,
        type === 'selected' && styles.selectedButton,
        pressed && styles.pressedButton
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          type === 'top' && styles.topButtonText,
          type === 'operator' && styles.operatorButtonText,
          type === 'selected' && styles.selectedButtonText
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

function Calculator() {
  const [display, setDisplay] = useState('0');
  const [storedValue, setStoredValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState(null);

  const rows = [
    [
      { title: 'AC', type: 'top' },
      { title: '+/-', type: 'top' },
      { title: '%', type: 'top' },
      { title: '÷', type: 'operator' }
    ],
    [
      { title: '7' },
      { title: '8' },
      { title: '9' },
      { title: '×', type: 'operator' }
    ],
    [
      { title: '4' },
      { title: '5' },
      { title: '6' },
      { title: '−', type: 'operator' }
    ],
    [
      { title: '1' },
      { title: '2' },
      { title: '3' },
      { title: '+', type: 'operator' }
    ],
    [
      { title: '0', wide: true },
      { title: '.' },
      { title: '=', type: 'operator' }
    ]
  ];

  function calculate(a, b, op) {
    if (op === '+') return a + b;
    if (op === '−') return a - b;
    if (op === '×') return a * b;
    if (op === '÷') return b === 0 ? null : a / b;
    return b;
  }

  function formatNumber(number) {
    if (!Number.isFinite(number)) return 'Error';
    return String(Number(number.toPrecision(10)));
  }

  function handlePress(title) {
    if (title === 'AC') {
      setDisplay('0');
      setStoredValue(null);
      setOperator(null);
      setWaiting(false);
      setSelectedOperator(null);
      return;
    }

    if (title === '+/-') {
      if (display !== 'Error') {
        setDisplay(formatNumber(-Number(display)));
      }
      return;
    }

    if (title === '%') {
      if (display !== 'Error') {
        setDisplay(formatNumber(Number(display) / 100));
      }
      return;
    }

    if ('0123456789'.includes(title) && title.length === 1) {
      if (display === 'Error' || waiting) {
        setDisplay(title);
        setWaiting(false);
      } else {
        setDisplay(display === '0' ? title : display + title);
      }
      return;
    }

    if (title === '.') {
      if (display === 'Error' || waiting) {
        setDisplay('0.');
        setWaiting(false);
      } else if (!display.includes('.')) {
        setDisplay(display + '.');
      }
      return;
    }

    if (['+', '−', '×', '÷'].includes(title)) {
      if (display === 'Error') return;

      let current = Number(display);

      if (storedValue !== null && operator && !waiting) {
        const result = calculate(
          storedValue,
          current,
          operator
        );

        if (result === null) {
          setDisplay('Error');
          setStoredValue(null);
          setOperator(null);
          setSelectedOperator(null);
          setWaiting(true);
          return;
        }

        current = result;
        setDisplay(formatNumber(result));
      }

      setStoredValue(current);
      setOperator(title);
      setSelectedOperator(title);
      setWaiting(true);
      return;
    }

    if (title === '=' && storedValue !== null && operator) {
      if (display === 'Error') return;

      const result = calculate(
        storedValue,
        Number(display),
        operator
      );

      setDisplay(result === null ? 'Error' : formatNumber(result));
      setStoredValue(null);
      setOperator(null);
      setSelectedOperator(null);
      setWaiting(true);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View style={styles.calculator}>
        <Display value={display} />

        <View style={styles.keypad}>
          {rows.map((row, rowIndex) => (
            <View style={styles.row} key={rowIndex}>
              {row.map((button) => (
                <CalcButton
                  key={button.title}
                  title={button.title}
                  type={
                    button.type === 'operator' &&
                    selectedOperator === button.title
                      ? 'selected'
                      : button.type
                  }
                  wide={button.wide}
                  onPress={() => handlePress(button.title)}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return <Calculator />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  calculator: {
    flex: 1,
    paddingHorizontal: '4.5%',
    paddingTop: 10,
    paddingBottom: 8
  },
  display: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingBottom: 28
  },
  displayText: {
    color: '#FFFFFF',
    fontSize: 90,
    fontWeight: '300',
    maxWidth: '100%'
  },
  keypad: {
    gap: 12
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  button: {
    width: '22.5%',
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center'
  },
  wideButton: {
    width: '48.5%',
    aspectRatio: 2.1,
    alignItems: 'flex-start',
    paddingLeft: '8%'
  },
  topButton: {
    backgroundColor: '#A5A5A5'
  },
  operatorButton: {
    backgroundColor: '#F5A638'
  },
  selectedButton: {
    backgroundColor: '#FFFFFF'
  },
  pressedButton: {
    opacity: 0.55
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '400'
  },
  topButtonText: {
    color: '#000000'
  },
  operatorButtonText: {
    color: '#FFFFFF'
  },
  selectedButtonText: {
    color: '#F5A638'
  }
});
