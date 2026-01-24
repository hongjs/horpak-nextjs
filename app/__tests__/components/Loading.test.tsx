import React from 'react'
import { render, screen, waitFor } from '../test-utils'
import Loading from '../../components/Loading'

describe('Loading Component', () => {
  it('should render the loading text', async () => {
    render(<Loading />)
    await waitFor(() => {
      expect(screen.getByText('Loading')).toBeInTheDocument()
    })
  })

  it('should render progress indicators', async () => {
    render(<Loading />)
    // Check for CircularProgress elements. Since we render two (one determinate background, one indeterminate foreground)
    await waitFor(() => {
      const progressbars = screen.getAllByRole('progressbar')
      expect(progressbars.length).toBeGreaterThanOrEqual(1)
    })
  })
})
