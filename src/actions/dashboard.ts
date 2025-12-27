'use server'

import { db } from '@/lib/db'
import { getTenant } from '@/lib/tenant'

export async function getDashboardStats() {
  const tenant = await getTenant()

  const [
    totalOpportunities,
    pipelineValue,
    recentActivities,
    upcomingTasks,
    totalContacts,
    totalCompanies,
    totalQuotes,
    openQuotes,
  ] = await Promise.all([
    // Total opportunities
    db.opportunity.count({
      where: { tenantId: tenant.id },
    }),

    // Pipeline value (sum of opportunity values)
    db.opportunity.aggregate({
      where: {
        tenantId: tenant.id,
        stage: { notIn: ['closed-won', 'closed-lost'] },
      },
      _sum: { value: true },
    }),

    // Recent activities (last 10)
    db.activity.findMany({
      where: { tenantId: tenant.id },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        contact: true,
        company: true,
        opportunity: true,
        quote: true,
      },
    }),

    // Upcoming tasks (due date in future)
    db.activity.findMany({
      where: {
        tenantId: tenant.id,
        type: 'TASK',
        completedAt: null,
        dueDate: { gte: new Date() },
      },
      take: 10,
      orderBy: { dueDate: 'asc' },
      include: {
        contact: true,
        company: true,
        opportunity: true,
      },
    }),

    // Total contacts
    db.contact.count({
      where: { tenantId: tenant.id },
    }),

    // Total companies
    db.company.count({
      where: { tenantId: tenant.id },
    }),

    // Total quotes
    db.quote.count({
      where: { tenantId: tenant.id },
    }),

    // Open quotes (not accepted/rejected/expired)
    db.quote.count({
      where: {
        tenantId: tenant.id,
        status: { notIn: ['ACCEPTED', 'REJECTED', 'EXPIRED'] },
      },
    }),
  ])

  return {
    totalOpportunities,
    pipelineValue: pipelineValue._sum.value || 0,
    recentActivities,
    upcomingTasks,
    totalContacts,
    totalCompanies,
    totalQuotes,
    openQuotes,
  }
}





