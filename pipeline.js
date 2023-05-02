const relationships=[
    {
        $lookup:{
            from:"users",
            localField:"owner",
            foreignField:"_id",
            as:"user"
        },
        
    },
    {
        $lookup:{
            from:"tweets",
            localField:"origin",
            foreignField:"_id",
            as:"origin_tweet",
            pipeline: [
				{
					$lookup: {
						from: "users",
						localField: "owner",
						foreignField: "_id",
						as: "user",
					},
				},
                
			],
        }
    },
    {
        $lookup:{
            from:"tweets",
            localField:"_id",
            foreignField:"origin",
            as:"shares",
            pipeline:[
                {
                    $match:{type:"share"}
                },
                {
                    $lookup:{
                        from:"users",
                        localField:"owner",
                        foreignField:"_id",
                        as:"user"
                    }
                }
            ]
        }
    },
    {
        $lookup:{
            from:"tweets",
            localField:"_id",
            foreignField:"origin",
            as:"comments",
            pipeline: [
                {
                    $match:{type:"comment"}
                },
				{
					$lookup: {
						from: "users",
						localField: "owner",
						foreignField: "_id",
						as: "user",
					},
				},
                {
                    $lookup:{
                        from: "tweets",
						localField: "_id",
						foreignField: "origin",
						as: "comments",
						pipeline: [
							{
								$match: { type: "comment" },
							},
						],
                    }
                }
			],
        }
    },
    {
        $lookup:{
            from:"users",
            localField:"likes",
            foreignField:"_id",
            as:"likes_users"
        }
    }
]

module.exports = relationships