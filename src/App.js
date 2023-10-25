import React from 'react';
import { atom, useRecoilState, useRecoilValue, RecoilRoot, atomFamily, selector } from 'recoil';

// Atom family to hold individual counter states
const counterStateFamily = atomFamily({
  key: 'counterStateFamily',
  default: 0,
});

// Atom to hold the list of counter IDs
const counterListState = atom({
  key: 'counterListState',
  default: [],
});

// Selector for derived total count
const totalCountState = selector({
  key: 'totalCountState',
  get: ({ get }) => {
    const counterList = get(counterListState);
    const counts = counterList.map((id) => get(counterStateFamily(id)));
    return counts.reduce((acc, curr) => acc + curr, 0);
  },
});

function Counter({ id }) {
  const [count, setCount] = useRecoilState(counterStateFamily(id));

  return (
    <div>
      <h3>Counter {id}</h3>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
}

function CounterList() {
  const [counterList, setCounterList] = useRecoilState(counterListState);

  return (
    <div>
      {counterList.map((id) => (
        <Counter key={id} id={id} />
      ))}
      <button
        onClick={() => {
          const newId = counterList.length ? Math.max(...counterList) + 1 : 0;
          setCounterList([...counterList, newId]);
        }}
      >
        Add Counter
      </button>
    </div>
  );
}

function TotalCount() {
  const totalCount = useRecoilValue(totalCountState);

  return (
    <div>
      <h2>Total Count: {totalCount}</h2>
    </div>
  );
}

function App() {
  return (
    <RecoilRoot>
      <div className="App">
        <h1>Recoil Counter Demo</h1>
        <CounterList />
        <TotalCount />
      </div>
    </RecoilRoot>
  );
}

export default App;
