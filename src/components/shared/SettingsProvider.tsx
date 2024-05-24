import {createContext, useContext, useState} from "react"

type Settings = {
  fallingImage: boolean
}

type SettingsProviderProps = {
  children: React.ReactNode
  storageKey: string
}

type SettingsProviderState = {
  settings: Settings
  setFalling: (e: boolean) => void
}

const initialState: SettingsProviderState = {
  settings: {fallingImage: true},
  setFalling: () => null,
}

const SettingsProviderContext = createContext<SettingsProviderState>(initialState)

export default function SettingsProvider({
                                           children,
                                           storageKey,
                                           ...props
                                         }: SettingsProviderProps) {

  const [settings, setFalling] = useState<Settings>(
      () => (JSON.parse(localStorage.getItem(storageKey) || JSON.stringify(initialState)) as Settings)
  )

  const [systemTheme] = useState<SettingsProviderState>();


  const value = {
    settings,
    systemTheme,
    setFalling: (e: boolean) => {
      const newSettings = {...settings}
      newSettings.fallingImage = e
      setFalling(newSettings)
      localStorage.setItem(storageKey, JSON.stringify(newSettings))
    }
  }

  return (
      <SettingsProviderContext.Provider {...props} value={value}>
        {children}
      </SettingsProviderContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}