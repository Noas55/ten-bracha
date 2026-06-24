import logging
from typing import Optional, Dict, Any, List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.foods import Foods

logger = logging.getLogger(__name__)


# ------------------ Service Layer ------------------
class FoodsService:
    """Service layer for Foods operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: Dict[str, Any]) -> Optional[Foods]:
        """Create a new foods"""
        try:
            obj = Foods(**data)
            self.db.add(obj)
            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Created foods with id: {obj.id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating foods: {str(e)}")
            raise

    async def get_by_id(self, obj_id: int) -> Optional[Foods]:
        """Get foods by ID"""
        try:
            query = select(Foods).where(Foods.id == obj_id)
            result = await self.db.execute(query)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching foods {obj_id}: {str(e)}")
            raise

    async def get_list(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        query_dict: Optional[Dict[str, Any]] = None,
        sort: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get paginated list of foodss"""
        try:
            query = select(Foods)
            count_query = select(func.count(Foods.id))
            
            if query_dict:
                for field, value in query_dict.items():
                    if hasattr(Foods, field):
                        query = query.where(getattr(Foods, field) == value)
                        count_query = count_query.where(getattr(Foods, field) == value)
            
            count_result = await self.db.execute(count_query)
            total = count_result.scalar()

            if sort:
                if sort.startswith('-'):
                    field_name = sort[1:]
                    if hasattr(Foods, field_name):
                        query = query.order_by(getattr(Foods, field_name).desc())
                else:
                    if hasattr(Foods, sort):
                        query = query.order_by(getattr(Foods, sort))
            else:
                query = query.order_by(Foods.id.desc())

            result = await self.db.execute(query.offset(skip).limit(limit))
            items = result.scalars().all()

            return {
                "items": items,
                "total": total,
                "skip": skip,
                "limit": limit,
            }
        except Exception as e:
            logger.error(f"Error fetching foods list: {str(e)}")
            raise

    async def update(self, obj_id: int, update_data: Dict[str, Any]) -> Optional[Foods]:
        """Update foods"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Foods {obj_id} not found for update")
                return None
            for key, value in update_data.items():
                if hasattr(obj, key):
                    setattr(obj, key, value)

            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Updated foods {obj_id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating foods {obj_id}: {str(e)}")
            raise

    async def delete(self, obj_id: int) -> bool:
        """Delete foods"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Foods {obj_id} not found for deletion")
                return False
            await self.db.delete(obj)
            await self.db.commit()
            logger.info(f"Deleted foods {obj_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting foods {obj_id}: {str(e)}")
            raise

    async def get_by_field(self, field_name: str, field_value: Any) -> Optional[Foods]:
        """Get foods by any field"""
        try:
            if not hasattr(Foods, field_name):
                raise ValueError(f"Field {field_name} does not exist on Foods")
            result = await self.db.execute(
                select(Foods).where(getattr(Foods, field_name) == field_value)
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching foods by {field_name}: {str(e)}")
            raise

    async def list_by_field(
        self, field_name: str, field_value: Any, skip: int = 0, limit: int = 20
    ) -> List[Foods]:
        """Get list of foodss filtered by field"""
        try:
            if not hasattr(Foods, field_name):
                raise ValueError(f"Field {field_name} does not exist on Foods")
            result = await self.db.execute(
                select(Foods)
                .where(getattr(Foods, field_name) == field_value)
                .offset(skip)
                .limit(limit)
                .order_by(Foods.id.desc())
            )
            return result.scalars().all()
        except Exception as e:
            logger.error(f"Error fetching foodss by {field_name}: {str(e)}")
            raise