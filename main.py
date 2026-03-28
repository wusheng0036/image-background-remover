#!/usr/bin/env python3
"""
Image Background Remover - Main Entry Point

Usage:
    python main.py --input input.jpg --output output.png
"""

import click
from pathlib import Path


@click.command()
@click.option('--input', '-i', 'input_path', required=True, help='Input image path')
@click.option('--output', '-o', 'output_path', default='output.png', help='Output image path')
def remove_background(input_path: str, output_path: str):
    """Remove background from an image."""
    input_file = Path(input_path)
    output_file = Path(output_path)
    
    if not input_file.exists():
        click.echo(f"❌ Error: Input file '{input_path}' not found")
        return
    
    # TODO: Implement background removal logic
    click.echo(f"🌀 Processing: {input_path}")
    click.echo(f"📤 Output: {output_path}")
    click.echo("⚠️  Background removal not yet implemented")


if __name__ == '__main__':
    remove_background()
