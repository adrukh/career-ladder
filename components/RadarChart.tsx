"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface RadarChartProps {
  layers: Array<{
    id: string
    label: string
    data: Array<{
      dimension: string
      value: number
      max: number
    }>
    color: string
    visible: boolean
  }>
  dimensions: Array<{
    id: string
    name: string
    icon: any
    color: string
  }>
  onLayerClick?: (layer: any) => void
  onDimensionClick?: (dimensionId: string, level: number) => void
}

export function RadarChart({ layers, dimensions, onLayerClick, onDimensionClick }: RadarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !layers.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = 400
    const height = 400
    const margin = 60
    const radius = Math.min(width, height) / 2 - margin

    const centerX = width / 2
    const centerY = height / 2

    svg.attr("width", width).attr("height", height)

    const g = svg.append("g").attr("transform", `translate(${centerX}, ${centerY})`)

    // Number of dimensions
    const numDimensions = dimensions.length
    const angleSlice = (Math.PI * 2) / numDimensions

    // Create scales
    const rScale = d3.scaleLinear().domain([0, 4]).range([0, radius])

    // Color mapping for dimensions
    const colorMap: Record<string, string> = {
      blue: "#3b82f6",
      green: "#10b981", 
      purple: "#8b5cf6",
      orange: "#f97316",
      cyan: "#06b6d4"
    }

    // Draw grid circles
    for (let i = 1; i <= 4; i++) {
      g.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", rScale(i))
        .style("fill", "none")
        .style("stroke", "#e2e8f0")
        .style("stroke-width", 1)
    }

    // Draw axis lines and labels (but not level markers yet)
    dimensions.forEach((dim, i) => {
      const angle = angleSlice * i - Math.PI / 2
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      const dimColor = colorMap[dim.color] || "#cbd5e1"

      // Axis line
      g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", y)
        .style("stroke", dimColor)
        .style("stroke-width", 2)
        .style("opacity", 0.3)

      // Dimension labels
      const labelX = Math.cos(angle) * (radius + 20)
      const labelY = Math.sin(angle) * (radius + 20)

      g.append("text")
        .attr("x", labelX)
        .attr("y", labelY)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "12px")
        .style("font-weight", "600")
        .style("fill", dimColor)
        .text(dim.name)
    })

    // Draw data layers
    layers.forEach((layer, layerIndex) => {
      if (!layer.visible) return

      const lineGenerator = d3
        .line<any>()
        .x((d, i) => {
          const angle = angleSlice * i - Math.PI / 2
          return Math.cos(angle) * rScale(d.value)
        })
        .y((d, i) => {
          const angle = angleSlice * i - Math.PI / 2
          return Math.sin(angle) * rScale(d.value)
        })
        .curve(d3.curveLinearClosed)

      // Create path
      const path = g
        .append("path")
        .datum(layer.data)
        .attr("d", lineGenerator)
        .style("fill", layer.color)
        .style("fill-opacity", 0.2)
        .style("stroke", layer.color)
        .style("stroke-width", 2)
        .style("cursor", onLayerClick ? "pointer" : "default")

      // Add click handler
      if (onLayerClick && !onDimensionClick) {
        path.on("click", () => onLayerClick(layer))
      }

      // Add data points
      layer.data.forEach((d, i) => {
        const angle = angleSlice * i - Math.PI / 2
        const x = Math.cos(angle) * rScale(d.value)
        const y = Math.sin(angle) * rScale(d.value)

        g.append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 4)
          .style("fill", layer.color)
          .style("stroke", "white")
          .style("stroke-width", 2)
          .style("cursor", onLayerClick ? "pointer" : "default")
          .on("click", onLayerClick ? () => onLayerClick(layer) : null)
      })
    })

    // Draw level markers on top of everything else
    dimensions.forEach((dim, i) => {
      const angle = angleSlice * i - Math.PI / 2
      const dimColor = colorMap[dim.color] || "#cbd5e1"

      // Level markers
      for (let level = 1; level <= 4; level++) {
        const levelRadius = rScale(level)
        const levelX = Math.cos(angle) * levelRadius
        const levelY = Math.sin(angle) * levelRadius

        g.append("circle")
          .attr("cx", levelX)
          .attr("cy", levelY)
          .attr("r", 3)
          .style("fill", dimColor)
          .style("stroke", "white")
          .style("stroke-width", 1)
          .style("opacity", 0.8)
          .style("cursor", onDimensionClick ? "pointer" : "default")
          .on("click", onDimensionClick ? () => onDimensionClick(dim.id, level) : null)
      }
    })

  }, [layers, dimensions, onLayerClick, onDimensionClick])

  return (
    <div className="flex justify-center">
      <svg ref={svgRef} className="max-w-full h-auto" />
    </div>
  )
}
