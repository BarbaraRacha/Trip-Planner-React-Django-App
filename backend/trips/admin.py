from django.contrib import admin
from .models import Trip

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ['id', 'pickup_location', 'dropoff_location', 'current_cycle_used', 'created_at']
    list_filter = ['created_at']
    search_fields = ['pickup_location', 'dropoff_location', 'current_location']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Trip Information', {
            'fields': ('current_location', 'pickup_location', 'dropoff_location')
        }),
        ('Driver Information', {
            'fields': ('current_cycle_used',)
        }),
        ('Metadata', {
            'fields': ('created_at',)
        }),
    )