import { RecoilRoot } from 'recoil'
import HomePage from './pages/index'

function App() {
  return (
    <RecoilRoot>
      {/* 페이지 컴포넌트는 Vite에서 Router 안 쓰면 기본적으로 index.tsx */}
      <HomePage />
    </RecoilRoot>
  )
}

export default App
