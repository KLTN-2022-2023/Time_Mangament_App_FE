import { Text } from 'native-base';
import { Dimensions, StyleSheet } from 'react-native';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart,
  } from 'react-native-chart-kit';
const StatictisComponent = ({ navigation }) => {
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: 10,
        },
        header: {
          textAlign: 'center',
          fontSize: 18,
          padding: 16,
          marginTop: 16,
        },
      });
    return (

              <>
                <Text style={styles.header}>Bar Chart</Text>
                <PieChart
                  data={[
                    {
                      name: 'Done',
                      population: 21500000,
                      color: 'rgba(131, 167, 234, 1)',
                      legendFontColor: '#7F7F7F',
               //       legendFontSize: 15,
                    },
                    {
                      name: 'Incomplete',
                      population: 2800000,
                      color: '#F00',
                      legendFontColor: '#7F7F7F',
                   //   legendFontSize: 15,
                    },
                    // {
                    //   name: 'New York',
                    //   population: 8538000,
                    //   color: '#ffffff',
                    //   legendFontColor: '#7F7F7F',
                    //  // legendFontSize: 15,
                    // },
                    // {
                    //   name: 'Moscow',
                    //   population: 11920000,
                    //   color: 'rgb(0, 0, 255)',
                    //   legendFontColor: '#7F7F7F',
                    // //  legendFontSize: 15,
                    // },
                  ]}
                  width={Dimensions.get('window').width - 16}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#1cc910',
                    backgroundGradientFrom: '#eff3ff',
                    backgroundGradientTo: '#efefef',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute //for the absolute number remove if you want percentage
                />
              </>

    )
}
export default StatictisComponent;