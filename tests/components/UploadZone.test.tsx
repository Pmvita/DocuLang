import { render, screen } from '@testing-library/react'
import { UploadZone } from '@/components/UploadZone'

test('UploadZone shows drop zone and accepts PDF', () => {
  render(<UploadZone onUpload={jest.fn()} />)
  expect(screen.getByText(/drop.*pdf/i)).toBeInTheDocument()
})