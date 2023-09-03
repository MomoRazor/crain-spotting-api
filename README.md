# crane-spotting-api

# System Structure

# Entities:

    - Crane
        - name: string
        - pictureUrl: string
        - location: {
            lat: number,
            lon: number
        }
        - discoveredOn: Date
        - ownerId: string
        - capturedOn: Date,
        - capturedBy: 'Photo' | 'Battle'
        - status: 'Active' | 'Removed' | 'Fake'
        - reports: [
            {
                pictureUrl: string
                reportedAs: 'Removed' | 'Fake'
            }
        ]
        - battleHistory: [
            {
                opponentCraneId: string,
                opponentUserPower: number,
                opponentCranePower: number,
                opponentRole: number,
                ownerUserRole: number,
                cranePower: number,
                ownerPower: number,
                result: 'Victory' | 'Defeat'
            }
        ]
        - craneHistory: [
            {
                name: string,
                power: number,
                pictureUrl: string,
                capturedOn: Date,
                ownerId: string,
                capturedBy: 'Photo' | 'Battle'
            }
        ]
    - Users (Firebase)
        - email: string
        - displayName: string

# System Flow

The flow begins by the user navigating to the Crane Spotting Website. Here the user can see a list of the current cranes that have been discovered
