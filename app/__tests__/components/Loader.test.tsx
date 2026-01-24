import React from 'react'
import { render, screen, waitFor } from '../test-utils'
import Loader from '../../components/Loader'

describe('Loader Component', () => {
  it('should render the loader with CircularProgress', async () => {
    render(<Loader />)
    await waitFor(() => {
      const progressbar = screen.getByRole('progressbar')
      expect(progressbar).toBeInTheDocument()
    })
  })

  it('should render centered on screen', async () => {
    const { container } = render(<Loader />)
    await waitFor(() => {
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('flex', 'items-center', 'justify-center', 'h-screen', 'w-screen')
    })
  })
})
