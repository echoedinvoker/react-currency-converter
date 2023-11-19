// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useEffect, useState } from "react";

export default function App() {
  const [input, setInput] = useState("")
  const [inCur, setInCur] = useState("USD")
  const [outCur, setOutCur] = useState("EUR")
  const [output, setOutput] = useState("")

  useEffect(function() {
    const controller = new AbortController()

    async function fetchCurrency() {
      try {
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${input}&from=${inCur}&to=${outCur}`,
          { signal: controller.signal }
        )
        if (!res.ok) throw new Error("Fetch error")

        const { rates: { [outCur]: output } } = await res.json()

        setOutput(output)
      } catch (err) {
        if (err.name !== "AbortError") {
          // console.log(err.message)
          setOutput(err.message)
        }
      }
    }

    if (Number(input)) fetchCurrency()
    else setOutput("")

    return function() {
      controller.abort()
    }
  }, [input, inCur, outCur])

  return (
    <div>
      <input type="text" value={input} onChange={e => setInput(e.target.value)} />
      <select value={inCur} onChange={e => setInCur(e.target.value)}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select value={outCur} onChange={e => setOutCur(e.target.value)}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <p>{output}</p>
    </div>
  );
}

