import { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [exportCount, setExportCount] = useState<number | null>(null)

  useEffect(() => {
    const dateInput = document.getElementById('date') as HTMLInputElement
    const timeInput = document.getElementById('time') as HTMLInputElement

    function setCurrentDateTime() {
      const now = new Date()
      dateInput.value = now.toISOString().split('T')[0]
      timeInput.value = now.toTimeString().slice(0, 5)
    }

    setCurrentDateTime()
    const interval = setInterval(setCurrentDateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      setMessage(result.message)
      setIsSuccess(response.ok)

      if (response.ok) {
        form.reset()
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('An error occurred. Please try again.')
      setIsSuccess(false)
    }
  }

  const handleExport = async () => {
    const dateInput = document.getElementById('date') as HTMLInputElement
    const timeInput = document.getElementById('time') as HTMLInputElement

    try {
      const response = await fetch(`/api/export?date=${dateInput.value}&time=${timeInput.value}`)
      const data = await response.json()
      setExportCount(data.count)
    } catch (error) {
      console.error('Error:', error)
      setMessage('Export failed. Please try again.')
      setIsSuccess(false)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Registration Form</title>
        <meta name="description" content="Registration form for our event" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Registration Form</h1>
        {message && (
          <p className={`${styles.message} ${isSuccess ? styles.success : styles.error}`}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="fullName">Full Name:</label>
            <input type="text" id="fullName" name="fullName" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="contact">Contact:</label>
            <input type="tel" id="contact" name="contact" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="session">Session:</label>
            <select id="session" name="session" required>
              <option value="">Select a session</option>
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="gender">Gender:</label>
            <select id="gender" name="gender" required>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="date">Date:</label>
            <input type="date" id="date" name="date" readOnly />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="time">Time:</label>
            <input type="time" id="time" name="time" readOnly />
          </div>
          <button type="submit" className={styles.submitButton}>Register</button>
        </form>
        <div className={styles.exportSection}>
          <button onClick={handleExport} className={styles.exportButton}>
            Export Registrations
          </button>
          {exportCount !== null && (
            <p className={styles.exportResult}>
              Number of registrations: {exportCount}
            </p>
          )}
        </div>
      </main>
    </div>
  )
}

