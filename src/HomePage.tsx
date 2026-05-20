import { Button, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

import type { RootState } from './store/store';
import { increment as incrementAction, decrement as decrementAction, incrementByTwo as incrementByTwoAction, fetchData } from './action/counter_action';

interface HomePageProps {
    counter: number;
    loading: boolean;
    error: null | string;
    increment: () => void;
    decrement: () => void;
    incrementByTwo: () => void;
    handleFetchData?: (errorTest: boolean) => void;
}

function HomePage({ counter, loading, error, increment, decrement, incrementByTwo, handleFetchData }: HomePageProps) {
    // const counter = useSelector((state: RootState) => state.counter);
    // const dispatch = useDispatch();

    // const increment = () => {
    //     dispatch({ type: 'INCREMENT' });
    // }

    // const decrement = () => {
    //     dispatch({ type: 'DECREMENT' });
    // }

    return (
        <View style={styles.container}>
            <Button title='Fetch Data' onPress={() => handleFetchData?.(false)} />
            <Button title='Increment by Two' onPress={incrementByTwo} />
            <Button title='Increment' onPress={increment} />
            {loading ? (
                <Text style={styles.loadingText}>Loading...</Text>
            ) : error ? (
                <Text style={styles.errorText}>Error: {error}</Text>
            ) : (
                <Text style={styles.counterText}>{counter}</Text>
            )}
            <Button title='Decrement' onPress={decrement} />
        </View>
    );
}

const mapStateToProps = (state: RootState) => ({
    counter: state.counter.counter,
    loading: state.counter.loading,
    error: state.counter.error,
})

const mapDispatchToProps = (dispatch: any) => ({
    increment: () => dispatch(incrementAction(1)),
    decrement: () => dispatch(decrementAction(1)),
    incrementByTwo: () => dispatch(incrementByTwoAction(2)),
    handleFetchData: (errorTest: boolean) => dispatch(fetchData(errorTest)),
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF9800',
    },
    errorText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F44336',
    },
    counterText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);