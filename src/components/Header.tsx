import classNames from "../utils/classNames";

export default function Header({ width }) {
  return (
    <header className="bg-white shadow">
      <div className={classNames('mx-auto px-4 py-6 sm:px-6 lg:px-8', `max-w-${width}xl`)}>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
      </div>
    </header>
  )
}
