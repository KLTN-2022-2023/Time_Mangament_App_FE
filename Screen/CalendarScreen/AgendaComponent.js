import { StyleSheet, Text, View, FlatList, ScrollView } from "react-native";
import { useState, useEffect } from "react";

export default ({ renderItem, renderSectionHeader, items, selected }) => {
  const [scrollToIndex, setScrollToIndex] = useState();
  const [dataSourceCords, setDataSourceCords] = useState([0, 0, 3, 4, 5, 6, 7]);
  const [ref, setRef] = useState(null);

  useEffect(() => {
    let index = items.findIndex((x) => x.title === selected);
    let result = index ? index : 0;
    setScrollToIndex(result);

    if (dataSourceCords.length > index && index >= 0) {
      if (ref) {
        ref.scrollTo({
          x: 0,
          y: dataSourceCords[index],
          animated: true,
        });
      }
    }
  }, [items, selected]);

  //   useEffect(() => {
  //     if (dataSourceCords.length > scrollToIndex) {
  //       if (ref) {
  //         ref.scrollTo({
  //           x: 0,
  //           y: dataSourceCords[scrollToIndex],
  //           animated: true,
  //         });
  //       }
  //     }
  //   }, [scrollToIndex]);

  const ItemView = (item, key) => {
    return (
      <View
        key={key}
        onLayout={(event) => {
          const layout = event.nativeEvent.layout;
          dataSourceCords[key] = layout.y;
          setDataSourceCords(dataSourceCords);
        }}
      >
        {renderSectionHeader(item.title)}
        {item.data.map((x, i) => renderItem(x, i))}
      </View>
    );
  };

  return (
    <View style={styles.safe}>
      {items && items.length > 0 ? (
        <ScrollView ref={(ref) => setRef(ref)}>
          {items.map(ItemView)}
        </ScrollView>
      ) : (
        // <FlatList
        //   data={items}
        //   renderItem={({ item }) => {
        //     return (
        //       <View>
        //         {renderSectionHeader(item.title)}
        //         {item.data.map((x) => renderItem(x))}
        //       </View>
        //     );
        //   }}
        //   keyExtractor={(item) => item.id}
        // />
        <View>
          <Text>No Data</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
});
