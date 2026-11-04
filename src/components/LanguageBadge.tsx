export function LanguageBadge({ language }: { language: string }) {
  return (
    <span className={`
      inline-block ml-2 px-2 py-0.5 text-xs rounded-full uppercase
      ${language === 'fr' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
    `}>
      {language}
    </span>
  )
}