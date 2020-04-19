import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Modal,
    FlatList,
    Dimensions,
    Platform
} from 'react-native';
import { getTotal, getAllCountry, getFlagOfCountry, getSelectedCountry, getAllDataForAll, getCountryDataApi } from '../api/api';
import { COLOR, FONT_SIZE, FONT_WEIGHT } from '../constants/global.constant';
import { dropDownIcon, closeIcon } from '../constants/image.constant';
import {
    LineChart,
} from 'react-native-chart-kit'
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';


function Item({ title, onSelect }) {
    return (

        <TouchableOpacity onPress={() => onSelect(title)} style={{ marginRight: 60 }}>
            <Text style={{ paddingLeft: 40, marginTop: 40 }}>{title}</Text>
        </TouchableOpacity>
    );
}

const barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
        {
            data: [20, 45, 28, 80, 99, 43],
        },
    ],
};


class HomeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalData: {
                confirmed: "2323408", recovered: "595157", critical: "55218", deaths: "159699"
            },
            countryData: {
                confirmed: "23408", recovered: "5", critical: "518", deaths: "699"
            },
            countryList: [],
            slectedCountry: 'india',
            slectedCountryCode: 'in',
            modalVisible: false,
            countryCodeList: [],
            active: 'global',
            dateArray: [],
            graphDataAll: {},
            graphDataCountry: {}



        }
    }

    getGlobalData = async () => {
        const response = await getTotal()
        this.setState({
            totalData: response
        })
    }

    getCountryData = async (name) => {
        const response = await getSelectedCountry(name)
        console.log(response)
        this.setState({
            countryData: response
        }, () => {
            console.log(this.state.countryData)
        })
    }

    getAllDataForDate = async () => {
        const temp = []
        const now = moment().format("YYYY-MM-DD");
        const tempDate = []
        for (let i = 2; i < 6; i++) {
            tempDate.unshift(moment().subtract(i, 'days').format("YYYY-MM-DD"))
            const response = await getAllDataForAll(moment().subtract(i, 'days').format("YYYY-MM-DD"))
            console.log("12", response)
            temp.unshift(parseInt(response))
        }
        this.setState({
            graphDataAll: {
                labels: tempDate,
                datasets: [
                    {
                        data: temp
                    },
                ],
            }
        }, () => console.log(this.state.graphDataAll))
    }

    getCountryDataForDate = async () => {
        const temp = []
        const now = moment().format("YYYY-MM-DD");
        const tempDate = []
        for (let i = 2; i < 6; i++) {
            tempDate.unshift(moment().subtract(i, 'days').format("YYYY-MM-DD"))
            const response = await getCountryDataApi(moment().subtract(i, 'days').format("YYYY-MM-DD"), this.state.slectedCountry)
            console.log("1", response)
            temp.unshift(parseInt(response))
        }
        this.setState({
            graphDataCountry: {
                labels: tempDate,
                datasets: [
                    {
                        data: temp
                    },
                ],
            }
        }, () => console.log('country', this.state.graphDataCountry))
    }

    componentDidMount = async () => {
        this.getGlobalData()
        this.getCountryData(this.state.slectedCountry.toLowerCase())
        this.getAllDataForDate()
        this.getCountryDataForDate()
        const countryList = await getAllCountry()
        this.setState({
            countryList: Object.values(countryList),
            countryCodeList: Object.keys(countryList),
        })
    }

    ModalEvent = () => {
        this.setState({
            modalVisible: !this.state.modalVisible
        })
    }

    getFlagUri = () => {
        return { uri: `https://www.countryflags.io/${this.state.slectedCountryCode.toLowerCase()}/flat/64.png` }
    }

    onSlectCountry = (name) => {
        this.getCountryData(name.toLowerCase())
        const index = this.state.countryList.indexOf(name);
        const countryCode = this.state.countryCodeList[index]
        this.setState({
            slectedCountry: name,
            modalVisible: false,
            slectedCountryCode: countryCode,
            //graphDataCountry: {}
        }, () => {
            this.getCountryDataForDate()
        })
    }

    changeLocation(value) {
        console.log(value)
        this.setState({
            active: value
        }, () => {
            console.log(this.state.active)
        })
    }

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }



    render() {
        const { modalVisible, slectedCountry, countryList, active, totalData, countryData } = this.state;
        console.log('inside', this.state.graphDataAll)
        return (

            <>
                <View style={styles.mainContainer}>
                    <ScrollView>
                        <View style={styles.upperContainer}>
                            <View style={styles.headerContainer}>
                                <Text style={styles.titleOne}>COVID-19</Text>
                                <TouchableOpacity onPress={() => { this.ModalEvent() }} style={styles.titleTwoContainer}>
                                    <Image source={this.getFlagUri()} style={{ height: 25, width: 30, resizeMode: 'cover', marginRight: 10 }} />
                                    <Text style={{ fontSize: FONT_SIZE.FONT_FIVE, fontWeight: 'bold' }}>
                                        {slectedCountry.toLocaleUpperCase()}
                                    </Text>
                                    <Image source={dropDownIcon()} style={{ height: 15, width: 15, resizeMode: 'cover', marginLeft: 5 }} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', margin: 20, backgroundColor: COLOR.LIGHT_PURPLE, borderRadius: 30, alignItems: 'center', height: 50 }}>
                                <TouchableOpacity onPress={() => { this.changeLocation('country') }} style={{ width: "48%", height: 40, borderRadius: 20, marginLeft: 5, alignItems: 'center', justifyContent: "center", backgroundColor: active === 'country' ? 'white' : null }}>
                                    <Text style={{ color: active === 'country' ? 'black' : 'white', fontSize: FONT_SIZE.FONT_FOUR, fontWeight: 'bold' }}>{slectedCountry.toUpperCase()}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { this.changeLocation('global') }} style={{ width: "48%", height: 40, borderRadius: 20, marginLeft: 5, alignItems: 'center', justifyContent: "center", backgroundColor: active === 'global' ? 'white' : null }}>
                                    <Text style={{ color: active === 'global' ? 'black' : 'white', fontSize: FONT_SIZE.FONT_FOUR, fontWeight: 'bold' }}>GLOBAL</Text>
                                </TouchableOpacity>
                            </View>
                            {active === 'global' ?
                                <View>
                                    <View style={{ flexDirection: 'row', marginLeft: 20, marginRight: 20, borderRadius: 30, alignItems: 'center', height: 100, justifyContent: 'space-between' }}>
                                        <View style={{ width: "47%", height: 100, borderRadius: 10, backgroundColor: COLOR.YELLOW, marginTop: 30, justifyContent: 'space-between' }}>
                                            <Text style={{ color: 'white', fontSize: FONT_SIZE.FONT_FOUR, fontWeight: 'bold', marginTop: 10, marginLeft: 10 }}>Affected</Text>
                                            <Text style={{ color: 'white', fontSize: FONT_SIZE.FONT_THREE, fontWeight: 'bold', marginLeft: 10, marginBottom: 10 }}>{this.numberWithCommas(totalData.confirmed)}</Text>
                                        </View>
                                        <View style={{ width: "47%", height: 100, borderRadius: 10, backgroundColor: COLOR.RED, marginTop: 30, justifyContent: 'space-between' }}>
                                            <Text style={{ color: 'white', fontSize: FONT_SIZE.FONT_FOUR, fontWeight: 'bold', marginTop: 10, marginLeft: 10 }}>Death</Text>
                                            <Text style={{ color: 'white', fontSize: FONT_SIZE.FONT_THREE, fontWeight: 'bold', marginLeft: 10, marginBottom: 10 }}>{this.numberWithCommas(totalData.deaths)}</Text>
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 30, flexDirection: 'row', marginLeft: 20, marginRight: 20, borderRadius: 30, alignItems: 'center', height: 100, justifyContent: 'space-between' }}>
                                        <View style={{ width: "30%", height: 100, borderRadius: 10, backgroundColor: COLOR.GREEN, marginTop: 30, justifyContent: 'space-between' }}>
                                            <Text style={{ color: 'white', fontSize: FONT_SIZE.FONT_FIVE, fontWeight: 'bold', marginTop: 10, marginLeft: 10 }}>Recovered</Text>
                                            <Text style={{ color: 'white', fontSize: FONT_SIZE.FONT_FOUR, fontWeight: 'bold', marginLeft: 10, marginBottom: 10 }}>{this.numberWithCommas(totalData.recovered)}</Text>
                                        </View>
                                        <View style={{ width: "30%", height: 100, borderRadius: 10, backgroundColor: COLOR.BLUE, marginTop: 30, justifyContent: 'space-between' }}>
                                            <Text style={{ color: 'white', fontSize: FONT_SIZE.FONT_FIVE, fontWeight: 'bold', marginTop: 10, marginLeft: 10 }}>Active</Text>
                                            <Text style={{ color: 'white', fontSize: FONT_SIZE.FONT_FOUR, fontWeight: 'bold', marginLeft: 10, marginBottom: 10 }}>{this.numberWithCommas(parseInt(totalData.confirmed) - (parseInt(totalData.deaths) + parseInt(totalData.recovered)))}</Text>
                                        </View>
                                        <View style={{ width: "30%", height: 100, borderRadius: 10, backgroundColor: COLOR.PURPLE_SECOND, marginTop: 30, justifyContent: 'space-between' }}>
                                            <Text style={{ color: 'white', fontSize: FONT_SIZE.FONT_FIVE, fontWeight: 'bold', marginTop: 10, marginLeft: 10 }}>Critical</Text>
                                            <Text style={{ color: 'white', fontSize: FONT_SIZE.FONT_FOUR, fontWeight: 'bold', marginLeft: 10, marginBottom: 10 }}>{this.numberWithCommas(totalData.critical)}</Text>
                                        </View>
                                    </View>
                                </View>
                                :
                                <View>
                                    <View style={{ flexDirection: 'row', marginLeft: 20, marginRight: 20, borderRadius: 30, alignItems: 'center', height: 100, justifyContent: 'space-between' }}>
                                        <View style={{ width: "47%", height: 100, borderRadius: 10, backgroundColor: COLOR.YELLOW, marginTop: 30, justifyContent: 'space-between' }}>
                                            <Text style={{ color: 'white', fontSize: FONT_SIZE.FONT_FOUR, fontWeight: 'bold', marginTop: 10, marginLeft: 10 }}>Affected</Text>
                                            <Text style={{ color: 'white', fontSize: FONT_SIZE.FONT_THREE, fontWeight: 'bold', marginLeft: 10, marginBottom: 10 }}>{this.numberWithCommas(countryData.confirmed)}</Text>
                                        </View>
                                        <View style={{ width: "47%", height: 100, borderRadius: 10, backgroundColor: COLOR.RED, marginTop: 30, justifyContent: 'space-between' }}>
                                            <Text style={{ color: 'white', fontSize: FONT_SIZE.FONT_FOUR, fontWeight: 'bold', marginTop: 10, marginLeft: 10 }}>Death</Text>
                                            <Text style={{ color: 'white', fontSize: FONT_SIZE.FONT_THREE, fontWeight: 'bold', marginLeft: 10, marginBottom: 10 }}>{this.numberWithCommas(countryData.deaths)}</Text>
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 30, flexDirection: 'row', marginLeft: 20, marginRight: 20, borderRadius: 30, alignItems: 'center', height: 100, justifyContent: 'space-between' }}>
                                        <View style={{ width: "30%", height: 100, borderRadius: 10, backgroundColor: COLOR.GREEN, marginTop: 30, justifyContent: 'space-between' }}>
                                            <Text style={{ color: 'white', fontSize: FONT_SIZE.FONT_FIVE, fontWeight: 'bold', marginTop: 10, marginLeft: 10 }}>Recovered</Text>
                                            <Text style={{ color: 'white', fontSize: FONT_SIZE.FONT_FOUR, fontWeight: 'bold', marginLeft: 10, marginBottom: 10 }}>{this.numberWithCommas(countryData.recovered)}</Text>
                                        </View>
                                        <View style={{ width: "30%", height: 100, borderRadius: 10, backgroundColor: COLOR.BLUE, marginTop: 30, justifyContent: 'space-between' }}>
                                            <Text style={{ color: 'white', fontSize: FONT_SIZE.FONT_FIVE, fontWeight: 'bold', marginTop: 10, marginLeft: 10 }}>Active</Text>
                                            <Text style={{ color: 'white', fontSize: FONT_SIZE.FONT_FOUR, fontWeight: 'bold', marginLeft: 10, marginBottom: 10 }}>{this.numberWithCommas(parseInt(countryData.confirmed) - (parseInt(countryData.deaths) + parseInt(countryData.recovered)))}</Text>
                                        </View>
                                        <View style={{ width: "30%", height: 100, borderRadius: 10, backgroundColor: COLOR.PURPLE_SECOND, marginTop: 30, justifyContent: 'space-between' }}>
                                            <Text style={{ color: 'white', fontSize: FONT_SIZE.FONT_FIVE, fontWeight: 'bold', marginTop: 10, marginLeft: 10 }}>Critical</Text>
                                            <Text style={{ color: 'white', fontSize: FONT_SIZE.FONT_FOUR, fontWeight: 'bold', marginLeft: 10, marginBottom: 10 }}>{this.numberWithCommas(countryData.critical)}</Text>
                                        </View>
                                    </View>
                                </View>
                            }
                        </View>
                        {active === 'global' ?
                            <View style={styles.lowerContainer}>
                                <Text style={{ paddingTop: 20, fontSize: FONT_SIZE.FONT_THREE, paddingLeft: 20 }}>
                                    Daily Recovered Cases
                                </Text>
                                {this.state.graphDataAll.datasets ?
                                    <LineChart
                                        style={{
                                            paddingTop: 20,
                                            paddingLeft: 10
                                        }}
                                        data={this.state.graphDataAll}
                                        width={Dimensions.get("screen").width}
                                        height={260}
                                        chartConfig={{
                                            backgroundColor: "#bcb1e3",
                                            backgroundGradientFrom: "#bcb1e3",
                                            backgroundGradientTo: "#bcb1e3",
                                            decimalPlaces: 0, // optional, defaults to 2dp
                                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                            style: {
                                                borderRadius: 16
                                            }
                                        }}
                                    />
                                    :
                                    <Text style={{ alignSelf: 'center', marginTop: 100 }}>
                                        Loading Graph...
                                    </Text>
                                }
                            </View>
                            :
                            <View style={styles.lowerContainer}>
                                <Text style={{ paddingTop: 20, fontSize: FONT_SIZE.FONT_THREE, paddingLeft: 20 }}>
                                    Daily Recovered Cases
                                </Text>
                                {this.state.graphDataCountry.datasets ?
                                    <LineChart
                                        style={{
                                            paddingTop: 20,
                                            paddingLeft: 10
                                        }}
                                        data={this.state.graphDataCountry}
                                        width={Dimensions.get("screen").width}
                                        height={260}
                                        chartConfig={{
                                            backgroundColor: "#bcb1e3",
                                            backgroundGradientFrom: "#bcb1e3",
                                            backgroundGradientTo: "#bcb1e3",
                                            decimalPlaces: 0, // optional, defaults to 2dp
                                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                            style: {
                                                borderRadius: 16
                                            },
                                        }}

                                    />
                                    :
                                    <Text style={{ alignSelf: 'center', marginTop: 50 }}>
                                        Loading Graph...
                                    </Text>
                                }
                            </View>
                        }
                    </ScrollView>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                    >

                        <View style={styles.modal}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ paddingTop: 20, fontSize: FONT_SIZE.FONT_THREE, paddingLeft: 20 }}> Select Country</Text>
                                <TouchableOpacity onPress={() => { this.setState({ modalVisible: false }) }} style={{ padding: 30 }}>
                                    <Image source={closeIcon()} style={{ height: 14, width: 14, resizeMode: 'contain' }} />
                                </TouchableOpacity>

                            </View>
                            <FlatList
                                data={countryList}
                                renderItem={({ item, index }) => (
                                    <View>
                                        <Item title={item} key={index} onSelect={this.onSlectCountry.bind(this)} />
                                    </View>
                                )}
                            />
                        </View>
                    </Modal>
                </View>
            </>
        );
    }
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#bcb1e3'
    },
    upperContainer: {
        backgroundColor: COLOR.PURPLE,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingBottom: 50
    },
    lowerContainer: {
        
        
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        marginTop: 30
    },
    titleOne: {
        color: 'white',
        fontSize: FONT_SIZE.FONT_THREE,
        fontWeight: FONT_WEIGHT.WEIGHT_600,
    },
    titleTwoContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5,
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 20
    },
    modal: {
        backgroundColor: 'white',
        margin: 30,
        borderRadius: 20
    }
});

export default HomeComponent;