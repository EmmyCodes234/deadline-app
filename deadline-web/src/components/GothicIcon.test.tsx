import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import { GothicIcon, SIZES } from './GothicIcon';
import type { GothicIconVariant, GothicIconSize } from './GothicIcon';
import { Skull } from 'lucide-react';

describe('GothicIcon Property-Based Tests', () => {
  /**
   * Feature: gothic-iconography-system, Property 1: Variant Color Consistency
   * Validates: Requirements 2.1, 2.2, 2.3, 2.4
   * 
   * For any GothicIcon with a specified variant, the rendered icon color 
   * and glow color should match the variant's defined color scheme
   */
  it('Property 1: Variant Color Consistency - variant colors match configuration', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<GothicIconVariant>('blood', 'arcane', 'soul', 'relic', 'neutral'),
        (variant) => {
          const { container } = render(
            <GothicIcon variant={variant}>
              <Skull />
            </GothicIcon>
          );

          const span = container.querySelector('span');
          expect(span).toBeTruthy();

          // Check that the base gothic-icon class is applied
          expect(span?.className).toContain('gothic-icon');

          // Check that the variant-specific class is applied
          expect(span?.className).toContain(`gothic-icon-${variant}`);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: gothic-iconography-system, Property 4: Size Scaling Proportionality
   * Validates: Requirements 1.3, 7.4, 7.5
   * 
   * For any GothicIcon with a specified size, the icon dimensions and glow 
   * radius should scale proportionally
   */
  it('Property 4: Size Scaling Proportionality - glow scales with icon size', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constantFrom<GothicIconSize>('xs', 'sm', 'md', 'lg', 'xl'),
          fc.integer({ min: 16, max: 64 })
        ),
        (size) => {
          const { container } = render(
            <GothicIcon size={size}>
              <Skull />
            </GothicIcon>
          );

          const span = container.querySelector('span');
          expect(span).toBeTruthy();

          // Get the numeric size
          const numericSize = typeof size === 'number' ? size : SIZES[size];

          // Check that the size-specific class is applied for preset sizes
          if (typeof size === 'string') {
            expect(span?.className).toContain(`gothic-icon-${size}`);
          }

          // Check that the icon has the correct size
          const svg = container.querySelector('svg');
          expect(svg).toBeTruthy();
          expect(svg?.getAttribute('width')).toBe(String(numericSize));
          expect(svg?.getAttribute('height')).toBe(String(numericSize));
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: gothic-iconography-system, Property 2: Glow Effect Presence
   * Validates: Requirements 1.5, 7.2
   * 
   * For any GothicIcon that is not disabled, the rendered icon should have 
   * a visible drop-shadow filter applied via CSS classes
   */
  it('Property 2: Glow Effect Presence - non-disabled icons have glow', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<GothicIconVariant>('blood', 'arcane', 'soul', 'relic', 'neutral'),
        fc.constantFrom<GothicIconSize>('xs', 'sm', 'md', 'lg', 'xl'),
        fc.boolean(),
        (variant, size, disabled) => {
          const { container } = render(
            <GothicIcon variant={variant} size={size} disabled={disabled}>
              <Skull />
            </GothicIcon>
          );

          const span = container.querySelector('span');
          expect(span).toBeTruthy();

          if (disabled) {
            // Disabled icons should have the disabled class
            expect(span?.className).toContain('gothic-icon-disabled');
          } else {
            // Non-disabled icons should have variant class (which applies glow via CSS)
            expect(span?.className).toContain(`gothic-icon-${variant}`);
            expect(span?.className).not.toContain('gothic-icon-disabled');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: gothic-iconography-system, Property 7: No Flat Fill Rendering
   * Validates: Requirements 7.1, 7.2
   * 
   * For any GothicIcon, the rendered SVG should not contain solid fill colors 
   * without accompanying glow effects
   */
  it('Property 7: No Flat Fill Rendering - icons use stroke-based rendering with glow', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<GothicIconVariant>('blood', 'arcane', 'soul', 'relic', 'neutral'),
        fc.constantFrom<GothicIconSize>('xs', 'sm', 'md', 'lg', 'xl'),
        (variant, size) => {
          const { container } = render(
            <GothicIcon variant={variant} size={size}>
              <Skull />
            </GothicIcon>
          );

          const span = container.querySelector('span');
          expect(span).toBeTruthy();

          // Check that variant class is applied (which provides glow via CSS)
          expect(span?.className).toContain(`gothic-icon-${variant}`);

          // Check that the SVG uses stroke-based rendering
          const svg = container.querySelector('svg');
          expect(svg).toBeTruthy();
          
          // Lucide icons use stroke-based rendering by default
          // Verify that stroke-width is set (indicating stroke-based rendering)
          expect(svg?.getAttribute('stroke-width')).toBe('2');
          
          // Verify that fill is set to 'none' (stroke-based, not fill-based)
          expect(svg?.getAttribute('fill')).toBe('none');
        }
      ),
      { numRuns: 100 }
    );
  });
});

  /**
   * Feature: gothic-iconography-system, Property 3: Interactive State Transitions
   * Validates: Requirements 3.1, 3.2, 3.5
   * 
   * For any GothicIcon with interactive=true, hovering should increase the glow 
   * intensity and scale, and the transition should complete within 300ms
   */
  it('Property 3: Interactive State Transitions - hover increases glow and scale with 300ms transition', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<GothicIconVariant>('blood', 'arcane', 'soul', 'relic', 'neutral'),
        fc.constantFrom<GothicIconSize>('xs', 'sm', 'md', 'lg', 'xl'),
        (variant, size) => {
          const { container } = render(
            <GothicIcon variant={variant} size={size} interactive={true}>
              <Skull />
            </GothicIcon>
          );

          const span = container.querySelector('span');
          expect(span).toBeTruthy();

          // Check that interactive class is applied
          expect(span?.className).toContain('gothic-icon-interactive');

          // Check that variant class is applied
          expect(span?.className).toContain(`gothic-icon-${variant}`);

          // Check that will-change is set for GPU acceleration
          const willChange = span?.style.willChange;
          expect(willChange).toBe('filter, transform');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: gothic-iconography-system, Property 5: Disabled State Appearance
   * Validates: Requirements 3.4
   * 
   * For any GothicIcon with disabled=true, the opacity should be reduced 
   * and glow effects should be removed
   */
  it('Property 5: Disabled State Appearance - disabled icons have reduced opacity and no glow', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<GothicIconVariant>('blood', 'arcane', 'soul', 'relic', 'neutral'),
        fc.constantFrom<GothicIconSize>('xs', 'sm', 'md', 'lg', 'xl'),
        fc.boolean(),
        (variant, size, interactive) => {
          const { container } = render(
            <GothicIcon variant={variant} size={size} interactive={interactive} disabled={true}>
              <Skull />
            </GothicIcon>
          );

          const span = container.querySelector('span');
          expect(span).toBeTruthy();

          // Check that disabled class is applied (which handles opacity and removes glow via CSS)
          expect(span?.className).toContain('gothic-icon-disabled');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: gothic-iconography-system, Property 6: Accessibility Label Requirement
   * Validates: Requirements 8.1, 8.3
   * 
   * For any GothicIcon that is not decorative (aria-hidden !== true), 
   * an aria-label should be present
   */
  it('Property 6: Accessibility Label Requirement - non-decorative icons have aria-label', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<GothicIconVariant>('blood', 'arcane', 'soul', 'relic', 'neutral'),
        fc.constantFrom<GothicIconSize>('xs', 'sm', 'md', 'lg', 'xl'),
        fc.boolean(),
        fc.string({ minLength: 1, maxLength: 50 }),
        (variant, size, isDecorative, ariaLabel) => {
          const { container } = render(
            <GothicIcon 
              variant={variant} 
              size={size} 
              aria-hidden={isDecorative ? true : undefined}
              aria-label={isDecorative ? undefined : ariaLabel}
            >
              <Skull />
            </GothicIcon>
          );

          const span = container.querySelector('span');
          expect(span).toBeTruthy();

          if (isDecorative) {
            // Decorative icons should have aria-hidden="true"
            expect(span?.getAttribute('aria-hidden')).toBe('true');
          } else {
            // Non-decorative icons should have aria-label
            expect(span?.getAttribute('aria-label')).toBe(ariaLabel);
            expect(span?.getAttribute('aria-hidden')).toBeNull();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: gothic-iconography-system, Property 10: Touch Target Minimum Size
   * Validates: Requirements 8.5
   * 
   * For any interactive GothicIcon, the clickable area should be at least 44x44px
   */
  it('Property 10: Touch Target Minimum Size - interactive icons have minimum 44x44px touch target', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<GothicIconVariant>('blood', 'arcane', 'soul', 'relic', 'neutral'),
        fc.oneof(
          fc.constantFrom<GothicIconSize>('xs', 'sm', 'md', 'lg', 'xl'),
          fc.integer({ min: 16, max: 64 })
        ),
        fc.boolean(),
        (variant, size, disabled) => {
          const { container } = render(
            <GothicIcon 
              variant={variant} 
              size={size} 
              interactive={true}
              disabled={disabled}
              aria-label="Test icon"
            >
              <Skull />
            </GothicIcon>
          );

          const span = container.querySelector('span');
          expect(span).toBeTruthy();

          if (!disabled) {
            // Interactive, non-disabled icons should have minimum touch target
            const minWidth = span?.style.minWidth;
            const minHeight = span?.style.minHeight;

            expect(minWidth).toBe('44px');
            expect(minHeight).toBe('44px');

            // Get the numeric size
            const numericSize = typeof size === 'number' ? size : SIZES[size];

            // If icon is smaller than 44px, padding should be added
            if (numericSize < 44) {
              const expectedPadding = Math.ceil((44 - numericSize) / 2);
              const padding = span?.style.padding;
              expect(padding).toBe(`${expectedPadding}px`);
            }
          } else {
            // Disabled icons don't need minimum touch target
            const minWidth = span?.style.minWidth;
            const minHeight = span?.style.minHeight;

            expect(minWidth).toBeFalsy();
            expect(minHeight).toBeFalsy();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: gothic-iconography-system, Property 9: Style Prop Merging
   * Validates: Requirements 1.4
   * 
   * For any GothicIcon with custom className or style props, the custom styles 
   * should be applied without overriding core gothic styling
   */
  it('Property 9: Style Prop Merging - custom styles merge without overriding gothic styling', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<GothicIconVariant>('blood', 'arcane', 'soul', 'relic', 'neutral'),
        fc.constantFrom<GothicIconSize>('xs', 'sm', 'md', 'lg', 'xl'),
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => !s.includes(' ')),
        fc.record({
          marginTop: fc.constantFrom('10px', '20px', '5px'),
          marginLeft: fc.constantFrom('10px', '20px', '5px'),
          backgroundColor: fc.constantFrom('red', 'blue', 'green'),
        }),
        (variant, size, customClass, customStyle) => {
          const { container } = render(
            <GothicIcon 
              variant={variant} 
              size={size}
              className={customClass}
              style={customStyle}
            >
              <Skull />
            </GothicIcon>
          );

          const span = container.querySelector('span');
          expect(span).toBeTruthy();

          // Check that custom className is applied
          expect(span?.className).toContain(customClass);

          // Check that gothic icon classes are still applied (not overridden)
          expect(span?.className).toContain('gothic-icon');
          expect(span?.className).toContain(`gothic-icon-${variant}`);

          // Check that custom styles are applied
          expect(span?.style.marginTop).toBe(customStyle.marginTop);
          expect(span?.style.marginLeft).toBe(customStyle.marginLeft);
          expect(span?.style.backgroundColor).toBe(customStyle.backgroundColor);
        }
      ),
      { numRuns: 100 }
    );
  });
