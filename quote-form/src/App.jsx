import QuoteForm from './QuoteForm'
import './App.css'

function App() {
  return (
    // Embed-friendly wrapper: the form lives inside the WP white card on 13 pages, so no
    // minHeight:100vh (it stretched the card to viewport height on short steps) and slim
    // paddings (the card supplies its own). Was: minHeight 100vh / 20 / 40 standalone-page mode.
    <div style={{ background: '#f7f9fb', paddingTop: 12, paddingBottom: 8 }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <QuoteForm />
    </div>
  )
}

export default App
