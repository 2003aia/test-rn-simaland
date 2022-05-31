/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  View,
} from 'react-native';

const App: () => Node = () => {
  const [categories, setCategories] = useState([]);
  const [path, setPath] = useState([]);
  const [select, setSelect] = useState(null);
  const fetchCategories = () => {
    fetch('https://www.sima-land.ru/api/v3/category/?page=1')
      .then(response => response.json())
      .then(data => {
        let list = [];
        data.items.forEach(element => {
          list.push(element);
        });
        setCategories(list);
      })
      .catch(err => console.log(err, 'error fetching categories'));
  };

  const fetchSubCategories = d => {
    console.log(d, 'sssad');
    let list = [];
    fetch(
      `https://www.sima-land.ru/api/v3/category/${d.id}/?expand=sub_categories`,
    )
      .then(response => response.json())
      .then(data => {
        data.sub_categories.forEach(el => {
          list.push(el.id);
        });
        setPath(list);
        if (path.length !== 0) {
          path.forEach((el, index) => {
            /* fetch(`https://www.sima-land.ru/api/v3/category/${el}`)
              .then(res => res.json())
              .then(data => {
                console.log(data, 'subcot');
              }); */
          });
        }
      })
      .catch(err => console.log(err, 'error fetching subcategories'));
  };

  const fetchItems = () => {
    fetch('https://www.sima-land.ru/api/v3/item/?expand=categories')
      .then(response => response.json())
      .then(data => {
        data.items.forEach(el => {
          console.log('items', el, 'items');
        });
      });
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelect(item.id);
          fetchSubCategories(item);
        }}>
        <View style={styles.item}>
          <Text style={styles.sectionTitle}>
            {item.id}. {item.name}
          </Text>
          {select === item.id &&
            path.map((d, index) => (
              <TouchableOpacity key={d}>
                <Text>{d}</Text>
              </TouchableOpacity>
            ))}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.sectionContainer}>
      <FlatList
        data={categories}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
});

export default App;
